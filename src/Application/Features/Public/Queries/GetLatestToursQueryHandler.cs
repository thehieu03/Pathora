using Application.Contracts.Public;
using Domain.CORS;
using Domain.Common.Repositories;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed class GetLatestToursQueryHandler(ITourRepository tourRepository) 
    : IQueryHandler<GetLatestToursQuery, ErrorOr<List<LatestTourVm>>>
{
    private readonly ITourRepository _tourRepository = tourRepository;

    public async Task<ErrorOr<List<LatestTourVm>>> Handle(GetLatestToursQuery request, CancellationToken cancellationToken)
    {
        var tours = await _tourRepository.FindLatestTours(request.Limit);

        var result = tours.Select(t => new LatestTourVm(
            t.Id,
            t.TourName,
            t.Thumbnail?.PublicURL,
            t.ShortDescription,
            t.CreatedOnUtc)).ToList();

        return result;
    }
}
