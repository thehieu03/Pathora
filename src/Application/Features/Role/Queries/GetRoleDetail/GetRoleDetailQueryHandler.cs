using Application.Contracts.Role;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Role.Queries.GetRoleDetail;

public sealed class GetRoleDetailQueryHandler(IRoleService roleService)
    : IQueryHandler<GetRoleDetailQuery, ErrorOr<RoleDetailVm>>
{
    public async Task<ErrorOr<RoleDetailVm>> Handle(GetRoleDetailQuery request, CancellationToken cancellationToken)
    {
        return await roleService.GetDetail(new GetRoleDetailRequest(request.RoleId));
    }
}
