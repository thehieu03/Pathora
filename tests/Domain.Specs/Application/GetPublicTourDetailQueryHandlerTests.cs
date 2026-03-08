using Application.Dtos;
using Application.Features.Public.Queries;
using AutoMapper;
using Application.Mapping;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class GetPublicTourDetailQueryHandlerTests
{
    private readonly ITourRepository _tourRepository = Substitute.For<ITourRepository>();
    private readonly IMapper _mapper;

    public GetPublicTourDetailQueryHandlerTests()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<TourProfile>());
        _mapper = config.CreateMapper();
    }

    [Fact]
    public async Task Handle_WhenTourExistsAndActive_ShouldReturnTourDtoWithNestedData()
    {
        // Arrange
        var tour = BuildActiveTour();
        _tourRepository.FindById(tour.Id, Arg.Any<bool>()).Returns(tour);

        var handler = new GetPublicTourDetailQueryHandler(_tourRepository, _mapper);

        // Act
        var result = await handler.Handle(
            new GetPublicTourDetailQuery(tour.Id),
            CancellationToken.None);

        // Assert
        Assert.False(result.IsError);
        Assert.Equal(tour.TourName, result.Value.TourName);
        Assert.Equal(tour.TourCode, result.Value.TourCode);
        Assert.NotNull(result.Value.Classifications);
        Assert.Single(result.Value.Classifications);
        Assert.Equal("VIP", result.Value.Classifications[0].Name);
        Assert.Single(result.Value.Classifications[0].Plans);
        Assert.Single(result.Value.Classifications[0].Plans[0].Activities);
        Assert.Single(result.Value.Classifications[0].Insurances);
    }

    [Fact]
    public async Task Handle_WhenTourNotFound_ShouldReturnNotFoundError()
    {
        // Arrange
        var id = Guid.CreateVersion7();
        _tourRepository.FindById(id, Arg.Any<bool>()).Returns((TourEntity?)null);

        var handler = new GetPublicTourDetailQueryHandler(_tourRepository, _mapper);

        // Act
        var result = await handler.Handle(
            new GetPublicTourDetailQuery(id),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsError);
        Assert.Equal("Tour.NotFound", result.FirstError.Code);
    }

    [Fact]
    public async Task Handle_WhenTourIsDeleted_ShouldReturnNotFoundError()
    {
        // Arrange
        var tour = BuildActiveTour();
        tour.IsDeleted = true;
        _tourRepository.FindById(tour.Id, Arg.Any<bool>()).Returns(tour);

        var handler = new GetPublicTourDetailQueryHandler(_tourRepository, _mapper);

        // Act
        var result = await handler.Handle(
            new GetPublicTourDetailQuery(tour.Id),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsError);
        Assert.Equal("Tour.NotFound", result.FirstError.Code);
    }

    [Fact]
    public async Task Handle_WhenTourIsInactive_ShouldReturnNotFoundError()
    {
        // Arrange
        var tour = BuildActiveTour();
        tour.Status = TourStatus.Inactive;
        _tourRepository.FindById(tour.Id, Arg.Any<bool>()).Returns(tour);

        var handler = new GetPublicTourDetailQueryHandler(_tourRepository, _mapper);

        // Act
        var result = await handler.Handle(
            new GetPublicTourDetailQuery(tour.Id),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsError);
        Assert.Equal("Tour.NotFound", result.FirstError.Code);
    }

    [Fact]
    public async Task Handle_WhenTourIsRejected_ShouldReturnNotFoundError()
    {
        // Arrange
        var tour = BuildActiveTour();
        tour.Status = TourStatus.Rejected;
        _tourRepository.FindById(tour.Id, Arg.Any<bool>()).Returns(tour);

        var handler = new GetPublicTourDetailQueryHandler(_tourRepository, _mapper);

        // Act
        var result = await handler.Handle(
            new GetPublicTourDetailQuery(tour.Id),
            CancellationToken.None);

        // Assert
        Assert.True(result.IsError);
        Assert.Equal("Tour.NotFound", result.FirstError.Code);
    }

    [Fact]
    public async Task Handle_WhenTourHasRoutesAndAccommodation_ShouldMapNestedData()
    {
        // Arrange
        var tour = BuildActiveTour();
        _tourRepository.FindById(tour.Id, Arg.Any<bool>()).Returns(tour);

        var handler = new GetPublicTourDetailQueryHandler(_tourRepository, _mapper);

        // Act
        var result = await handler.Handle(
            new GetPublicTourDetailQuery(tour.Id),
            CancellationToken.None);

        // Assert
        Assert.False(result.IsError);
        var activity = result.Value.Classifications[0].Plans[0].Activities[0];
        Assert.Single(activity.Routes);
        Assert.Equal("Paris", activity.Routes[0].FromLocation!.LocationName);
        Assert.NotNull(activity.Accommodation);
        Assert.Equal("Hotel", activity.Accommodation.AccommodationName);
    }

    private static TourEntity BuildActiveTour()
    {
        var fromLocation = TourPlanLocationEntity.Create(
            "Paris", LocationType.TouristAttraction, "tester",
            city: "Paris", country: "France");

        var route = TourPlanRouteEntity.Create(
            1, TransportationType.Walking, "tester");
        route.FromLocation = fromLocation;
        route.ToLocation = fromLocation;

        var activity = TourDayActivityEntity.Create(
            Guid.CreateVersion7(), 1,
            TourDayActivityType.Sightseeing,
            "Visit Eiffel Tower", "tester");
        activity.Routes = [route];
        activity.Accommodation = TourPlanAccommodationEntity.Create(
            "Hotel", RoomType.Double, 4, MealType.None, "tester");

        var day = TourDayEntity.Create(Guid.CreateVersion7(), 1, "Day 1", "tester");
        day.Activities = [activity];

        var insurance = TourInsuranceEntity.Create(
            "Travel Insurance", InsuranceType.Travel, "Allianz",
            "Full coverage", 100000m, 50m, "tester", isOptional: true);

        var classification = TourClassificationEntity.Create(
            Guid.CreateVersion7(), "VIP", 1000m, 900m, "VIP package", 3, "tester");
        classification.Plans = [day];
        classification.Insurances = [insurance];

        return new TourEntity
        {
            Id = Guid.CreateVersion7(),
            TourCode = "TOUR-001",
            TourName = "Paris Tour",
            ShortDescription = "A great tour",
            LongDescription = "A detailed description of the tour",
            Status = TourStatus.Active,
            IsDeleted = false,
            Thumbnail = new ImageEntity { PublicURL = "https://img/thumb.jpg" },
            Images = [new ImageEntity { PublicURL = "https://img/1.jpg" }],
            Classifications = [classification],
            CreatedBy = "tester",
            LastModifiedBy = "tester",
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }
}
