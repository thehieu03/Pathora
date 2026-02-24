using Application.Contracts.Identity;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Commands.Refresh;

public sealed class RefreshCommandHandler(IIdentityService identityService)
    : ICommandHandler<RefreshCommand, ErrorOr<RefreshTokenResponse>>
{
    public async Task<ErrorOr<RefreshTokenResponse>> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        return await identityService.Refresh(new RefreshTokenRequest(request.RefreshToken));
    }
}
