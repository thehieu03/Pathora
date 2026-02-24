using Application.Contracts.Identity;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Commands.Logout;

public sealed class LogoutCommandHandler(IIdentityService identityService)
    : ICommandHandler<LogoutCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        return await identityService.Logout(new LogoutRequest(request.RefreshToken));
    }
}
