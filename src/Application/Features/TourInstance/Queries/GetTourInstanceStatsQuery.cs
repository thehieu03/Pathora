using Application.Dtos;
using BuildingBlocks.CORS;
using ErrorOr;
using Application.Services;

namespace Application.Features.TourInstance.Queries;

public sealed record GetTourInstanceStatsQuery() : IQuery<ErrorOr<TourInstanceStatsDto>>;

public sealed class GetTourInstanceStatsQueryHandler(ITourInstanceService tourInstanceService)
    : IQueryHandler<GetTourInstanceStatsQuery, ErrorOr<TourInstanceStatsDto>>
{
    public async Task<ErrorOr<TourInstanceStatsDto>> Handle(GetTourInstanceStatsQuery request, CancellationToken cancellationToken)
    {
        return await tourInstanceService.GetStats();
    }
}

