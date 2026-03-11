using BuildingBlocks.CORS;
using Domain.Common.Repositories;
using Domain.Reports;
using ErrorOr;

namespace Application.Features.Admin.Queries;

public sealed record GetAdminOverviewQuery : IQuery<ErrorOr<AdminOverviewReport>>;

public sealed class GetAdminOverviewQueryHandler(IAdminOverviewRepository adminOverviewRepository)
    : IQueryHandler<GetAdminOverviewQuery, ErrorOr<AdminOverviewReport>>
{
    public async Task<ErrorOr<AdminOverviewReport>> Handle(GetAdminOverviewQuery request, CancellationToken cancellationToken)
    {
        return await adminOverviewRepository.GetOverview(cancellationToken);
    }
}
