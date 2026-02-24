using Application.Contracts.Role;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Role.Commands.DeleteRole;

public sealed class DeleteRoleCommandHandler(IRoleService roleService)
    : ICommandHandler<DeleteRoleCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        return await roleService.Delete(new DeleteRoleRequest(request.RoleId));
    }
}
