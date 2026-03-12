using Application.Features.Public.Queries;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class SearchToursQueryHandlerTests
{
    [Fact]
    public async Task Handle_WhenFiltersProvided_ShouldPassFiltersToRepository()
    {
        var query = new SearchToursQuery(
            Q: "beach",
            Destination: "Paris",
            Classification: "VIP",
            Date: new DateOnly(2026, 6, 15),
            People: 4,
            MinPrice: 1000m,
            MaxPrice: 5000m,
            MinDays: 3,
            MaxDays: 7,
            Page: 2,
            PageSize: 10);

        var repository = Substitute.For<ITourRepository>();
        repository.SearchTours(
                "beach",
                "Paris",
                "VIP",
                new DateOnly(2026, 6, 15),
                4,
                1000m,
                5000m,
                3,
                7,
                2,
                10)
            .Returns([BuildTour("Filtered")]);
        repository.CountSearchTours(
                "beach",
                "Paris",
                "VIP",
                new DateOnly(2026, 6, 15),
                4,
                1000m,
                5000m,
                3,
                7)
            .Returns(11);

        var handler = new SearchToursQueryHandler(repository);

        var result = await handler.Handle(query, CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(11, result.Value.Total);
        Assert.Single(result.Value.Data);
        Assert.Equal("Filtered", result.Value.Data[0].TourName);

        await repository.Received(1).SearchTours(
            "beach",
            "Paris",
            "VIP",
            new DateOnly(2026, 6, 15),
            4,
            1000m,
            5000m,
            3,
            7,
            2,
            10);
        await repository.Received(1).CountSearchTours(
            "beach",
            "Paris",
            "VIP",
            new DateOnly(2026, 6, 15),
            4,
            1000m,
            5000m,
            3,
            7);
    }

    [Fact]
    public async Task Handle_WhenRepositoryReturnsDifferentCount_ShouldKeepCountForPagination()
    {
        var repository = Substitute.For<ITourRepository>();
        repository.SearchTours(null, null, null, null, null, null, null, null, null, 1, 10)
            .Returns([BuildTour("Only one on this page")]);
        repository.CountSearchTours(null, null, null, null, null, null, null, null, null)
            .Returns(25);

        var handler = new SearchToursQueryHandler(repository);

        var result = await handler.Handle(
            new SearchToursQuery(null, null, null, null, null, null, null, null, null, 1, 10),
            CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(25, result.Value.Total);
        Assert.Single(result.Value.Data);
    }

    private static TourEntity BuildTour(string tourName)
    {
        var fromLocation = TourPlanLocationEntity.Create(
            "Paris",
            LocationType.TouristAttraction,
            "tester",
            city: "Paris",
            country: "France");

        var route = TourPlanRouteEntity.Create(
            1,
            TransportationType.Walking,
            "tester");
        route.FromLocation = fromLocation;
        route.ToLocation = fromLocation;

        var activity = TourDayActivityEntity.Create(
            Guid.CreateVersion7(),
            1,
            TourDayActivityType.Sightseeing,
            "activity",
            "tester");
        activity.Routes = [route];
        activity.Accommodation = TourPlanAccommodationEntity.Create(
            "Hotel",
            RoomType.Double,
            6,
            MealType.None,
            "tester");

        var day = TourDayEntity.Create(Guid.CreateVersion7(), 1, "day 1", "tester");
        day.Activities = [activity];

        var classification = TourClassificationEntity.Create(
            Guid.CreateVersion7(),
            "VIP",
            1000m,
            900m,
            0m,
            "desc",
            3,
            2,
            "tester");
        classification.Plans = [day];

        return new TourEntity
        {
            Id = Guid.CreateVersion7(),
            TourCode = $"TOUR-{Guid.NewGuid():N}"[..12],
            TourName = tourName,
            ShortDescription = "short",
            LongDescription = "long",
            Status = TourStatus.Active,
            Thumbnail = new ImageEntity { PublicURL = "https://img" },
            Classifications = [classification],
            CreatedBy = "tester",
            LastModifiedBy = "tester",
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }
}
