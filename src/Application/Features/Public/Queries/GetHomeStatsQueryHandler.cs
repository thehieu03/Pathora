using Application.Contracts.Public;
using Domain.CORS;
using Domain.Common.Repositories;
using ErrorOr;

namespace Application.Features.Public.Queries;

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
