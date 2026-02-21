using Application.Contracts.User;
using Domain.Entities;
using ErrorOr;

namespace Application.Common.Repositories;

public interface IUserRepository
{
    Task<ErrorOr<Success>> Upsert(UserEntity user);
    Task<ErrorOr<List<UserDto>>> FindAll(string userId, string departmentId);
    Task<ErrorOr<UserEntity?>> FindById(string userId);
    Task<ErrorOr<UserEntity?>> FindByEmail(string email);
    Task<ErrorOr<bool>> IsEmailUnique(string email);
    Task<ErrorOr<Success>> UpsertRefreshToken(RefreshTokenEntity refreshToken);
    Task<ErrorOr<RefreshTokenEntity?>> FindRefreshToken(string token);
    Task<ErrorOr<Success>> InvalidateToken(string token);
}