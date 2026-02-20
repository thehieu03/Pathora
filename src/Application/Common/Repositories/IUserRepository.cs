using Application.Contracts.User;
using Domain.Entities;
using ErrorOr;

namespace Application.Common.Repositories;

public interface IUserRepository
{
    Task<ErrorOr<Success>> Upsert(User user);
    Task<ErrorOr<List<UserDto>>> FindAll(string userId, string departmentId);
    Task<ErrorOr<User?>> FindById(string userId);
    Task<ErrorOr<User?>> FindByEmail(string email);
    Task<ErrorOr<bool>> IsEmailUnique(string email);
    Task<ErrorOr<Success>> UpsertRefreshToken(RefreshToken refreshToken);
    Task<ErrorOr<RefreshToken?>> FindRefreshToken(string token);
    Task<ErrorOr<Success>> InvalidateToken(string token);
}