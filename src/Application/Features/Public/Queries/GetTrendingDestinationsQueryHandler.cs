using Application.Contracts.Public;
using Domain.CORS;
using Domain.Common.Repositories;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed class GetTrendingDestinationsQueryHandler(ITourRepository tourRepository) 
    : IQueryHandler<GetTrendingDestinationsQuery, ErrorOr<List<TrendingDestinationVm>>>
{
    private readonly ITourRepository _tourRepository = tourRepository;

    public async Task<ErrorOr<List<TrendingDestinationVm>>> Handle(GetTrendingDestinationsQuery request, CancellationToken cancellationToken)
    {
        var destinations = await _tourRepository.GetTrendingDestinations(request.Limit);

        var result = destinations.Select(d => new TrendingDestinationVm(
            d.City,
            d.Country,
            null,
            d.ToursCount)).ToList();

        return result;
    }
}
