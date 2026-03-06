using Application.Contracts.Public;
using BuildingBlocks.CORS;
using Domain.Common.Repositories;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed class GetTopAttractionsQueryHandler(ITourRepository tourRepository) 
    : IQueryHandler<GetTopAttractionsQuery, ErrorOr<List<TopAttractionVm>>>
{
    private readonly ITourRepository _tourRepository = tourRepository;

    public async Task<ErrorOr<List<TopAttractionVm>>> Handle(GetTopAttractionsQuery request, CancellationToken cancellationToken)
    {
        var attractions = await _tourRepository.GetTopAttractions(request.Limit);

        var result = attractions.Select(a => new TopAttractionVm(
            a.LocationName,
            a.Address,
            null,
            a.City ?? string.Empty,
            a.Country ?? string.Empty)).ToList();

        return result;
    }
}

