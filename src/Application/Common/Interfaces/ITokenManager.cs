using Domain.Entities;
using ErrorOr;

namespace Application.Common.Interfaces;

public interface ITokenManager
{
    // Task<ErrorOr<(string, string)>> GenerateToken(UserEntity user);
    Task<ErrorOr<(string, string)>> RefreshToken(string token);
    Task<ErrorOr<Success>> RevokeToken(string userId, string refreshToken);
}