using Application.Common;
using Contracts.Interfaces;
using Application.Contracts.Public;
using BuildingBlocks.CORS;
using ErrorOr;
using Domain.Common.Repositories;

namespace Application.Features.Public.Queries;

public sealed record GetHomeStatsQuery : IQuery<ErrorOr<HomeStatsVm>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Tour}:home-stats";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}

public sealed class GetHomeStatsQueryHandler(
    ITourRepository tourRepository,
    ISystemKeyRepository systemKeyRepository)
    : IQueryHandler<GetHomeStatsQuery, ErrorOr<HomeStatsVm>>
{
    private readonly ITourRepository _tourRepository = tourRepository;
    private readonly ISystemKeyRepository _systemKeyRepository = systemKeyRepository;

    public async Task<ErrorOr<HomeStatsVm>> Handle(GetHomeStatsQuery request, CancellationToken cancellationToken)
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
    }
}

