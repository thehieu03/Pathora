using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.User.Commands.ChangePassword;

public sealed class ChangePasswordCommandHandler(IUserService userService)
    : ICommandHandler<ChangePasswordCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        return await userService.ChangePassword(new Contracts.User.ChangePasswordRequest(request.UserId));
    }
}
