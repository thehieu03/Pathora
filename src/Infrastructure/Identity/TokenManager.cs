using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.Common;
using Application.Common.Interfaces;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.UnitOfWork;
using ErrorOr;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ZiggyCreatures.Caching.Fusion;

namespace Infrastructure.Identity;

internal sealed class TokenManager(
    IOptions<JwtOptions> jwtOptions,
    IUserRepository userRepository,
    IFusionCache fusionCache,
    IToken token,
    IUnitOfWork unitOfWork)
    : ITokenManager
{
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;
    private const int RefreshTokenTimeoutInHours = 24 * 7;

    public async Task<ErrorOr<(string AccessToken, string RefreshToken)>> GenerateToken(UserEntity user)
    {
        var key = Encoding.UTF8.GetBytes(_jwtOptions.Secret);
        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Iss, _jwtOptions.Issuer),
                new Claim(JwtRegisteredClaimNames.Aud, _jwtOptions.Audience)
            ]),
            Expires = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpireInMinutes),
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.CreateToken(tokenDescriptor);
        var accessToken = tokenHandler.WriteToken(jwtToken);

        var refreshTokenValue = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        var refreshTokenEntity = new RefreshTokenEntity
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresOnUtc = DateTimeOffset.UtcNow.AddHours(RefreshTokenTimeoutInHours)
        };

        var repo = unitOfWork.GenericRepository<RefreshTokenEntity>();
        await repo.AddAsync(refreshTokenEntity);

        return (accessToken, refreshTokenValue);
    }

    public async Task<ErrorOr<(string, string)>> RefreshToken(string refreshToken)
    {
        var repo = unitOfWork.GenericRepository<RefreshTokenEntity>();
        var tokens = await repo.GetListAsync(t => t.Token == refreshToken);
        var tokenEntity = tokens.FirstOrDefault();

        if (tokenEntity is null)
            return Error.NotFound("RefreshToken.NotFound", "Refresh token không tồn tại");

        if (!tokenEntity.IsActive)
            return Error.Validation("RefreshToken.Expired", "Refresh token đã hết hạn");

        var user = await userRepository.FindById(tokenEntity.UserId);
        if (user is null)
            return Error.NotFound("User.NotFound", "Người dùng không tồn tại");

        // Delete old refresh token
        repo.Delete(tokenEntity);

        // Generate new token pair
        return await GenerateToken(user);
    }

    public async Task<ErrorOr<Success>> RevokeToken(string userId, string refreshToken)
    {
        // Blacklist the current access token
        var jti = token.Id;
        var exp = token.Expire;
        if (!string.IsNullOrEmpty(jti) && long.TryParse(exp, out var expEpoch))
        {
            var diff = expEpoch - DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            if (diff > 0)
            {
                await fusionCache.SetAsync($"{CacheKey.AccessToken}:blacklisted:{jti}", jti,
                    new FusionCacheEntryOptions
                    {
                        Duration = TimeSpan.FromSeconds(diff)
                    });
            }
        }

        // Delete the refresh token from DB
        var repo = unitOfWork.GenericRepository<RefreshTokenEntity>();
        var tokens = await repo.GetListAsync(t => t.Token == refreshToken);
        var tokenEntity = tokens.FirstOrDefault();
        if (tokenEntity is not null)
        {
            repo.Delete(tokenEntity);
        }

        return Result.Success;
    }
}
