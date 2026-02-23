using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.Common;
using Application.Common.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ZiggyCreatures.Caching.Fusion;

namespace Infrastructure.Identity;

internal sealed class TokenManager : ITokenManager
{
    private readonly IOptions<JwtOptions> _jwtOptions;
    private readonly IUserRepository _userRepository;
    private readonly IFusionCache _fusionCache;
    private readonly IToken _token;
    private const int TokenTimeoutInHour = 24 * 7;

    public TokenManager(
        IOptions<JwtOptions> jwtOptions,
        IUserRepository userRepository,
        IFusionCache fusionCache,
        IToken token)
    {
        _jwtOptions = jwtOptions;
        _userRepository = userRepository;
        _fusionCache = fusionCache;
        _token = token;
    }


    // public async Task<ErrorOr<(string, string)>> GenerateToken(UserEntity user)
    // {
    //     // Generate access token
    //     var key = Encoding.UTF8.GetBytes(_jwtOptions.Value.Secret);
    //     var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
    //
    //     var tokenDescriptor = new SecurityTokenDescriptor
    //     {
    //         Subject = new ClaimsIdentity([
    //             new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    //             new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
    //             new Claim(JwtRegisteredClaimNames.Iss, _jwtOptions.Value.Issuer),
    //             new Claim(JwtRegisteredClaimNames.Aud, _jwtOptions.Value.Audience)
    //         ]),
    //         Expires = DateTime.UtcNow.AddMinutes(_jwtOptions.Value.ExpireInMinutes),
    //         SigningCredentials = credentials
    //     };
    //
    //     var tokenHandler = new JwtSecurityTokenHandler();
    //     var token = tokenHandler.CreateToken(tokenDescriptor);
    //     var accessToken = tokenHandler.WriteToken(token);
    //
    //     // Generate refresh token & persist to database 
    //     var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    //     //var result = await _userRepository.UpsertRefreshToken(new RefreshToken
    //     //{
    //     //    UserId = user.Id,
    //     //    Token = refreshToken,
    //     //    ExpiresOnUtc = DateTimeOffset.UtcNow.AddHours(TokenTimeoutInHour)
    //     //});
    //     //if (result.IsError) return result.Errors;
    //
    //     return (accessToken, refreshToken);
    // }

 

    //public async Task<ErrorOr<Success>> RevokeToken(string userId, string refreshToken)
    //{
    //    var jti = _token.Id;
    //    var exp = _token.Expire;
    //    if (!string.IsNullOrEmpty(jti) && long.TryParse(exp, out var expEpoch))
    //    {
    //        var diff = expEpoch - DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    //        if (diff > 0)
    //        {
    //            await _fusionCache.SetAsync($"{CacheKey.AccessToken}:blacklisted:{jti}", jti,
    //                new FusionCacheEntryOptions
    //                {
    //                    Duration = TimeSpan.FromSeconds(diff)
    //                });
    //        }
    //    }

    //    return await _userRepository.InvalidateToken(refreshToken);
    //}

    public Task<ErrorOr<(string, string)>> RefreshToken(string token)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> RevokeToken(string userId, string refreshToken)
    {
        throw new NotImplementedException();
    }
}