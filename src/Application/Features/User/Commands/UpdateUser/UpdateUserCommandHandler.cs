using Application.Contracts.User;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.User.Commands.UpdateUser;

public sealed class UpdateUserCommandHandler(IUserService userService)
    : ICommandHandler<UpdateUserCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        return await userService.Update(new UpdateUserRequest(
            request.Id, request.Departments, request.RoleIds, request.FullName, request.Avatar));
    }
}
