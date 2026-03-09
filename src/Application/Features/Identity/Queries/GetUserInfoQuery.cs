using Application.Contracts.Identity;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Identity.Queries;

public sealed record GetUserInfoQuery() : IQuery<ErrorOr<UserInfoVm>>;

public sealed class GetUserInfoQueryHandler(IIdentityService identityService)
    : IQueryHandler<GetUserInfoQuery, ErrorOr<UserInfoVm>>
{
    public async Task<ErrorOr<UserInfoVm>> Handle(GetUserInfoQuery request, CancellationToken cancellationToken)
    {
        return await identityService.GetUserInfo();
    }
}
