using Application.Common;
using Contracts.Interfaces;
using Application.Contracts.Public;
using BuildingBlocks.CORS;
using ErrorOr;
using Domain.Common.Repositories;
using Domain.Entities;

namespace Application.Features.Public.Queries;

public sealed record GetFeaturedToursQuery(int Limit = 8) : IQuery<ErrorOr<List<FeaturedTourVm>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Tour}:featured:{Limit}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
}

public sealed class GetFeaturedToursQueryHandler(ITourRepository tourRepository) 
    : IQueryHandler<GetFeaturedToursQuery, ErrorOr<List<FeaturedTourVm>>>
{
    private readonly ITourRepository _tourRepository = tourRepository;

    public async Task<ErrorOr<List<FeaturedTourVm>>> Handle(GetFeaturedToursQuery request, CancellationToken cancellationToken)
    {
        var tours = await _tourRepository.FindFeaturedTours(request.Limit);

        var result = tours.Select(t =>
        {
            var classification = t.Classifications.FirstOrDefault();
            return new FeaturedTourVm(
                t.Id,
                t.TourName,
                t.Thumbnail?.PublicURL,
                GetMainLocation(t),
                null,
                classification?.DurationDays ?? 0,
                classification?.Price ?? 0,
                classification?.SalePrice ?? 0,
                classification?.Name);
        }).ToList();

        return result;
    }

    private static string? GetMainLocation(TourEntity tour)
    {
        var firstClassification = tour.Classifications.FirstOrDefault();
        if (firstClassification?.Plans == null || !firstClassification.Plans.Any())
            return null;

        var firstDay = firstClassification.Plans.FirstOrDefault();
        if (firstDay?.Activities == null || !firstDay.Activities.Any())
            return null;

        var firstActivity = firstDay.Activities.FirstOrDefault();
        if (firstActivity?.Routes == null || !firstActivity.Routes.Any())
            return null;

        var firstRoute = firstActivity.Routes.FirstOrDefault();
        return firstRoute?.FromLocation != null 
            ? $"{firstRoute.FromLocation.City}, {firstRoute.FromLocation.Country}"
            : null;
    }
}

