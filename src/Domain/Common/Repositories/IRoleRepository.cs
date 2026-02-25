using Domain.Entities;
using Domain.Enums;
using ErrorOr;

namespace Domain.Common.Repositories;

public interface IRoleRepository
{
    Task<ErrorOr<Success>> Create(RoleEntity role);
    Task<ErrorOr<Success>> Update(RoleEntity role);

    Task<ErrorOr<Success>> AddUser(Guid userId, List<Guid> roleIds);
    Task<ErrorOr<Success>> DeleteUser(Guid userId);
    Task<ErrorOr<List<(Guid UserId, Guid RoleId)>>> FindAllUserRoles();
    Task<ErrorOr<List<RoleEntity>>> GetAll();
    Task<ErrorOr<RoleEntity?>> FindById(string roleId);
    Task<ErrorOr<List<RoleEntity>>> FindByUserId(string userId);
    Task<ErrorOr<Dictionary<Guid, List<RoleEntity>>>> FindByUserIds(List<Guid> userIds);

    Task<ErrorOr<List<RoleEntity>>> FindAll(
        string? roleName = null,
        RoleStatus status = RoleStatus.Active,
        int pageNumber = 0,
        int pageSize = 0);

    Task<ErrorOr<int>> CountAll(string? roleName = null, RoleStatus status = RoleStatus.Active);
}
