using Domain.Entities;
using Domain.Enums;
using ErrorOr;

namespace Domain.Common.Repositories;

public interface IRoleRepository
{
    Task<ErrorOr<Success>> Create(Role role);
    Task<ErrorOr<Success>> Update(Role role);

    Task<ErrorOr<Success>> AddUser(Guid userId, List<Guid> roleIds);
    Task<ErrorOr<Success>> DeleteUser(Guid userId);
    Task<ErrorOr<List<(Guid UserId, Guid RoleId)>>> FindAllUserRoles();
    Task<ErrorOr<List<Role>>> GetAll();
    Task<ErrorOr<Role?>> FindById(string roleId);
    Task<ErrorOr<List<Role>>> FindByUserId(string userId);

    Task<ErrorOr<List<Role>>> FindAll(
        string? roleName = null,
        RoleStatus status = RoleStatus.Active,
        int pageNumber = 0,
        int pageSize = 0);

    Task<ErrorOr<int>> CountAll(string? roleName = null, RoleStatus status = RoleStatus.Active);
}
