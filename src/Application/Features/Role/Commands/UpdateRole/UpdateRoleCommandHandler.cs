using Application.Contracts.Role;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Role.Commands.UpdateRole;

public sealed class UpdateRoleCommandHandler(IRoleService roleService)
    : ICommandHandler<UpdateRoleCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    {
        return await roleService.Update(new UpdateRoleRequest(
            request.RoleId, request.Name, request.Description, request.Status, request.Type, request.FunctionIds));
    }
}
