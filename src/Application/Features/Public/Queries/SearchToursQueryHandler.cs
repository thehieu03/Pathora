using Application.Common.Contracts;
using Application.Contracts.Public;
using Domain.CORS;
using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed class SearchToursQueryHandler(ITourRepository tourRepository) 
    : IQueryHandler<SearchToursQuery, ErrorOr<PaginatedList<SearchTourVm>>>
{
    private readonly ITourRepository _tourRepository = tourRepository;

    public async Task<ErrorOr<PaginatedList<SearchTourVm>>> Handle(SearchToursQuery request, CancellationToken cancellationToken)
    {
        var tours = await _tourRepository.SearchTours(
            request.Destination,
            request.Classification,
            request.Page,
            request.PageSize);

        var total = await _tourRepository.CountSearchTours(
            request.Destination,
            request.Classification);

        var result = tours.Select(t =>
        {
            var classification = t.Classifications.FirstOrDefault();
            return new SearchTourVm(
                t.Id,
                t.TourName,
                t.Thumbnail?.PublicURL,
                t.ShortDescription,
                GetMainLocation(t),
                classification?.DurationDays ?? 0,
                classification?.Price ?? 0,
                classification?.SalePrice ?? 0,
                classification?.Name,
                null);
        }).ToList();

        return new PaginatedList<SearchTourVm>(total, result);
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
