using Application.Contracts.Identity;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Commands.Login;

public sealed class LoginCommandHandler(IIdentityService identityService)
    : ICommandHandler<LoginCommand, ErrorOr<LoginResponse>>
{
    public async Task<ErrorOr<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        return await identityService.Login(new LoginRequest(request.Email, request.Password));
    }
}
