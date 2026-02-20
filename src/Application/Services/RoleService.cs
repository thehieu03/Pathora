using Application.Common.Contracts;
using Application.Common.Interfaces;
using Application.Common.Repositories;
using Application.Contracts.Role;
using Domain.Constant;
using Domain.Entities;
using Domain.Enums;
using ErrorOr;
using Result = ErrorOr.Result;

namespace Application.Services;

public interface IRoleService
{
    Task<ErrorOr<Guid>> Create(CreateRoleRequest request);
    Task<ErrorOr<Success>> Update(UpdateRoleRequest request);
    Task<ErrorOr<Success>> Delete(DeleteRoleRequest request);
    Task<ErrorOr<PaginatedListWithPermissions<RoleVm>>> GetAll(GetAllRoleRequest request);
    Task<ErrorOr<List<LookupVm>>> GetAll();
    Task<ErrorOr<RoleDetailVm>> GetDetail(GetRoleDetailRequest request);
    Task<ErrorOr<Dictionary<string, bool>>> HasFunctions(string userId, int categoryId, string[] type);
}

public class RoleService : IRoleService
{
    private readonly IUser _user;
    private readonly IUnitOfWork _uow;

    public RoleService(IUser user, IUnitOfWork uow)
    {
        _user = user;
        _uow = uow;
    }

    public Task<ErrorOr<Guid>> Create(CreateRoleRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Delete(DeleteRoleRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<PaginatedListWithPermissions<RoleVm>>> GetAll(GetAllRoleRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<List<LookupVm>>> GetAll()
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<RoleDetailVm>> GetDetail(GetRoleDetailRequest request)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Dictionary<string, bool>>> HasFunctions(string userId, int categoryId, string[] type)
    {
        throw new NotImplementedException();
    }

    public Task<ErrorOr<Success>> Update(UpdateRoleRequest request)
    {
        throw new NotImplementedException();
    }
}