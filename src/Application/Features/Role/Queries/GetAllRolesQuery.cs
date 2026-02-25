using Application.Common.Contracts;
using Application.Contracts.Role;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Role.Queries;

public sealed record GetAllRolesQuery()
    : IQuery<ErrorOr<PaginatedListWithPermissions<RoleVm>>>;

public sealed class GetAllRolesQueryHandler(IRoleService roleService)
    : IQueryHandler<GetAllRolesQuery, ErrorOr<PaginatedListWithPermissions<RoleVm>>>
{
    public async Task<ErrorOr<PaginatedListWithPermissions<RoleVm>>> Handle(GetAllRolesQuery request, CancellationToken cancellationToken)
    {
        return await roleService.GetAll(new GetAllRoleRequest());
    }
}

