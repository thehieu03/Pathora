using Application.Contracts.Identity;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Identity.Queries;

public sealed class GetTabsQueryHandler(IIdentityService identityService)
    : IQueryHandler<GetTabsQuery, ErrorOr<List<TabVm>>>
{
    public async Task<ErrorOr<List<TabVm>>> Handle(GetTabsQuery request, CancellationToken cancellationToken)
    {
        return await identityService.GetTabs();
    }
}


