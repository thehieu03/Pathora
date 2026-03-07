using Domain.Entities;
using ErrorOr;

namespace Domain.Common.Repositories;

public interface IUserRepository
{
    Task<UserEntity?> FindByEmail(string email);
    Task<UserEntity?> FindById(Guid id);
    Task<UserEntity?> FindByGoogleId(string googleId);
    Task Create(UserEntity user);
    Task Update(UserEntity user);
    Task SoftDelete(Guid id);
    Task<List<UserEntity>> FindAll(string? textSearch, Guid? departmentId, int pageNumber, int pageSize);
    Task<int> CountAll(string? textSearch, Guid? departmentId);
    Task<bool> IsEmailUnique(string email);
}
