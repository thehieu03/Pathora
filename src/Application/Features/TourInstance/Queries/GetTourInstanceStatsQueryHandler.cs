using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.TourInstance.Queries;

public sealed class GetTourInstanceStatsQueryHandler(ITourInstanceService tourInstanceService)
    : IQueryHandler<GetTourInstanceStatsQuery, ErrorOr<TourInstanceStatsDto>>
{
    public async Task<ErrorOr<TourInstanceStatsDto>> Handle(GetTourInstanceStatsQuery request, CancellationToken cancellationToken)
    {
        return await tourInstanceService.GetStats();
    }
}
