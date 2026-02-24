using Application.Contracts.Identity;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Commands.Register;

public sealed class RegisterCommandHandler(IIdentityService identityService)
    : ICommandHandler<RegisterCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        return await identityService.Register(new RegisterRequest(request.Username, request.FullName, request.Email, request.Password));
    }
}
