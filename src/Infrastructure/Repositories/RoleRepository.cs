using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using ErrorOr;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class RoleRepository : IRoleRepository
{
    private readonly AppDbContext _context;
    public RoleRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<ErrorOr<Success>> AddUser(Guid userId, List<Guid> roleIds)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<int>> CountAll(string? roleName = null, RoleStatus status = RoleStatus.Active)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Create(Role role)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> DeleteUser(Guid userId)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<Role>>> FindAll(string? roleName = null, RoleStatus status = RoleStatus.Active, int pageNumber = 0, int pageSize = 0)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<(Guid UserId, Guid RoleId)>>> FindAllUserRoles()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Role?>> FindById(string roleId)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<Role>>> FindByUserId(string userId)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<Role>>> GetAll()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Update(Role role)
    {
        throw new NotImplementedException();
    }
}