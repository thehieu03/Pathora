using Application.Common;
using Contracts.Interfaces;
using Application.Contracts.Public;
using BuildingBlocks.CORS;
using ErrorOr;
using Domain.Common.Repositories;

namespace Application.Features.Public.Queries;

public sealed record GetLatestToursQuery(int Limit = 6) : IQuery<ErrorOr<List<LatestTourVm>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Tour}:latest:{Limit}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
}

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

