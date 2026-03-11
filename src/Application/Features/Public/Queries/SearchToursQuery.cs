using Contracts;
using Application.Contracts.Public;
using BuildingBlocks.CORS;
using ErrorOr;
using Domain.Common.Repositories;
using Domain.Entities;

namespace Application.Features.Public.Queries;

public sealed record SearchToursQuery(
    string? Q,
    string? Destination,
    string? Classification,
    DateOnly? Date,
    int? People,
    decimal? MinPrice,
    decimal? MaxPrice,
    int? MinDays,
    int? MaxDays,
    int Page = 1,
    int PageSize = 10) : IQuery<ErrorOr<PaginatedList<SearchTourVm>>>;

public sealed class SearchToursQueryHandler(ITourRepository tourRepository)
    : IQueryHandler<SearchToursQuery, ErrorOr<PaginatedList<SearchTourVm>>>
{
    private readonly ITourRepository _tourRepository = tourRepository;

    public async Task<ErrorOr<PaginatedList<SearchTourVm>>> Handle(SearchToursQuery request, CancellationToken cancellationToken)
    {
        var tours = await _tourRepository.SearchTours(
            request.Q,
            request.Destination,
            request.Classification,
            request.Date,
            request.People,
            request.MinPrice,
            request.MaxPrice,
            request.MinDays,
            request.MaxDays,
            request.Page,
            request.PageSize);

        var total = await _tourRepository.CountSearchTours(
            request.Q,
            request.Destination,
            request.Classification,
            request.Date,
            request.People,
            request.MinPrice,
            request.MaxPrice,
            request.MinDays,
            request.MaxDays);

        var result = tours.Select(t =>
        {
            var classification = t.Classifications.FirstOrDefault();
            return new SearchTourVm(
                t.Id,
                t.TourName,
                t.Thumbnail?.PublicURL,
                t.ShortDescription,
                GetMainLocation(t),
                classification?.NumberOfDay ?? 0,
                classification?.AdultPrice ?? 0,
                classification?.ChildPrice ?? 0,
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

