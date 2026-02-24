using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.User.Commands.DeleteUser;

public sealed class DeleteUserCommandHandler(IUserService userService)
    : ICommandHandler<DeleteUserCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        return await userService.Delete(request.Id);
    }
}
