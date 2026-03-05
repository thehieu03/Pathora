using Application.Features.Public.Queries;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class SearchToursQueryHandlerTests
{
    [Fact]
    public async Task Handle_WhenPeopleProvided_ShouldExcludeToursWithoutEnoughCapacity()
    {
        var lowCapacityTour = BuildTour("Low capacity", createdOnUtc: new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero), roomCapacity: 2);
        var highCapacityTour = BuildTour("High capacity", createdOnUtc: new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero), roomCapacity: 6);

        var tourRepository = Substitute.For<ITourRepository>();
        tourRepository.SearchTours("Paris", "VIP", 1, 10)
            .Returns([lowCapacityTour, highCapacityTour]);
        tourRepository.CountSearchTours("Paris", "VIP")
            .Returns(2);

        var handler = new SearchToursQueryHandler(tourRepository);

        var result = await handler.Handle(
            new SearchToursQuery("Paris", "VIP", null, 4, 1, 10),
            CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value.Data);
        Assert.Equal("High capacity", result.Value.Data[0].TourName);
        Assert.Equal(1, result.Value.Total);
    }

    [Fact]
    public async Task Handle_WhenDateProvided_ShouldExcludeToursCreatedAfterRequestedDate()
    {
        var oldTour = BuildTour("Old tour", createdOnUtc: new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero), roomCapacity: 6);
        var newTour = BuildTour("New tour", createdOnUtc: new DateTimeOffset(2026, 12, 1, 0, 0, 0, TimeSpan.Zero), roomCapacity: 6);

        var tourRepository = Substitute.For<ITourRepository>();
        tourRepository.SearchTours(null, null, 1, 10)
            .Returns([oldTour, newTour]);
        tourRepository.CountSearchTours(null, null)
            .Returns(2);

        var handler = new SearchToursQueryHandler(tourRepository);

        var result = await handler.Handle(
            new SearchToursQuery(null, null, new DateOnly(2026, 6, 15), null, 1, 10),
            CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value.Data);
        Assert.Equal("Old tour", result.Value.Data[0].TourName);
        Assert.Equal(1, result.Value.Total);
    }

    private static TourEntity BuildTour(string tourName, DateTimeOffset createdOnUtc, int roomCapacity)
    {
        var fromLocation = TourPlanLocationEntity.Create(
            "Paris", LocationType.TouristAttraction, "tester",
            city: "Paris", country: "France");

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
            roomCapacity,
            MealType.None,
            "tester");

        var day = TourDayEntity.Create(Guid.CreateVersion7(), 1, "day 1", "tester");
        day.Activities = [activity];

        var classification = TourClassificationEntity.Create(
            Guid.CreateVersion7(),
            "VIP",
            1000m,
            900m,
            "desc",
            3,
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
            CreatedOnUtc = createdOnUtc,
            LastModifiedOnUtc = createdOnUtc
        };
    }
}
