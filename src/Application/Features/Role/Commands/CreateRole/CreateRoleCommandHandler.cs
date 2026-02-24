using Application.Contracts.Role;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Role.Commands.CreateRole;

public sealed class CreateRoleCommandHandler(IRoleService roleService)
    : ICommandHandler<CreateRoleCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        return await roleService.Create(new CreateRoleRequest(request.Name, request.Description, request.Type, request.FunctionIds));
    }
}
