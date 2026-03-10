using Contracts;
using Application.Contracts.Public;
using BuildingBlocks.CORS;
using ErrorOr;
using Domain.Common.Repositories;
using Domain.Entities;

namespace Application.Features.Public.Queries;

public sealed record SearchToursQuery(
    string? Destination,
    string? Classification,
    DateOnly? Date,
    int? People,
    int Page = 1,
    int PageSize = 10) : IQuery<ErrorOr<PaginatedList<SearchTourVm>>>;

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

        var filteredTours = ApplyOptionalFilters(tours, request).ToList();
        if (request.Date.HasValue || request.People.HasValue)
        {
            total = filteredTours.Count;
        }

        var result = filteredTours.Select(t =>
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

    private static IEnumerable<TourEntity> ApplyOptionalFilters(IEnumerable<TourEntity> tours, SearchToursQuery request)
    {
        var query = tours;

        if (request.Date.HasValue)
        {
            var latestCreatedOnUtc = new DateTimeOffset(
                request.Date.Value.ToDateTime(TimeOnly.MaxValue),
                TimeSpan.Zero);
            query = query.Where(t => t.CreatedOnUtc <= latestCreatedOnUtc);
        }

        if (request.People.HasValue)
        {
            var requiredPeople = request.People.Value;
            query = query.Where(t => HasEnoughCapacity(t, requiredPeople));
        }

        return query;
    }

    private static bool HasEnoughCapacity(TourEntity tour, int requiredPeople)
    {
        return tour.Classifications.Any(c =>
            c.Plans.Any(p =>
                p.Activities.Any(a =>
                        a.Accommodation is not null &&
                        a.Accommodation.RoomCapacity >= requiredPeople)));
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

