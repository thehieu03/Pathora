using Application.Contracts.Public;
using BuildingBlocks.CORS;
using Domain.Common.Repositories;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed class GetDestinationsQueryHandler(ITourRepository tourRepository) 
    : IQueryHandler<GetDestinationsQuery, ErrorOr<List<string>>>
{
    private readonly ITourRepository _tourRepository = tourRepository;

    public async Task<ErrorOr<List<string>>> Handle(GetDestinationsQuery request, CancellationToken cancellationToken)
    {
        var destinations = await _tourRepository.GetAllDestinations();
        return destinations;
    }
}

