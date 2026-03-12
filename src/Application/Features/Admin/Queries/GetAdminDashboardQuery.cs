using BuildingBlocks.CORS;
using Domain.Common.Repositories;
using Domain.Reports;
using ErrorOr;

namespace Application.Features.Admin.Queries;

public sealed record GetAdminDashboardQuery : IQuery<ErrorOr<AdminDashboardReport>>;

public sealed class GetAdminDashboardQueryHandler(IAdminDashboardRepository adminDashboardRepository)
    : IQueryHandler<GetAdminDashboardQuery, ErrorOr<AdminDashboardReport>>
{
    public async Task<ErrorOr<AdminDashboardReport>> Handle(GetAdminDashboardQuery request, CancellationToken cancellationToken)
    {
        return await adminDashboardRepository.GetDashboard(cancellationToken);
    }
}
