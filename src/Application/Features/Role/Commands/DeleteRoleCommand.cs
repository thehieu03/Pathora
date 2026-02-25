using Domain.CORS;
using ErrorOr;
using Application.Contracts.Role;
using Application.Services;

namespace Application.Features.Role.Commands;

public sealed record DeleteRoleCommand(string RoleId) : ICommand<ErrorOr<Success>>;

public sealed class DeleteRoleCommandHandler(IRoleService roleService)
    : ICommandHandler<DeleteRoleCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        return await roleService.Delete(new DeleteRoleRequest(request.RoleId));
    }
}


