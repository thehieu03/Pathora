using Application.Contracts.Public;
using Domain.CORS;
using Domain.Common.Repositories;
using ErrorOr;
using ZiggyCreatures.Caching.Fusion;

namespace Application.Features.Public.Queries;

public sealed class GetHomeStatsQueryHandler(
    ITourRepository tourRepository, 
    ISystemKeyRepository systemKeyRepository,
    IFusionCache cache) 
    : IQueryHandler<GetHomeStatsQuery, ErrorOr<HomeStatsVm>>
{
    private readonly ITourRepository _tourRepository = tourRepository;
    private readonly ISystemKeyRepository _systemKeyRepository = systemKeyRepository;
    private readonly IFusionCache _cache = cache;

    public async Task<ErrorOr<HomeStatsVm>> Handle(GetHomeStatsQuery request, CancellationToken cancellationToken)
    {
        var stats = await _cache.GetOrSetAsync(
            "home_stats_payload",
            async _ =>
            {
                var totalTours = await _tourRepository.GetTotalActiveTours();
                var totalDistance = await _tourRepository.GetTotalDistanceKm();

                var totalTravelers = 10000;
                var travelersKey = await _systemKeyRepository.FindByCode("TOTAL_TRAVELERS");
                if (travelersKey != null)
                {
                    totalTravelers = travelersKey.CodeValue;
                }

                return new HomeStatsVm(totalTravelers, totalTours, totalDistance);
            },
            TimeSpan.FromMinutes(5),
            cancellationToken);

        return stats;
    }
}
