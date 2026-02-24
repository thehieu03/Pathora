using Application.Contracts.User;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.User.Commands.CreateUser;

public sealed class CreateUserCommandHandler(IUserService userService)
    : ICommandHandler<CreateUserCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        return await userService.Create(new CreateUserRequest(
            request.Departments, request.RoleIds, request.Email, request.FullName, request.Avatar));
    }
}
