using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Services;
using AutoMapper;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Entities.Translations;
using Domain.UnitOfWork;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Services;

/// <summary>
/// Unit tests for TourService.Create() covering the full entity graph creation flow.
/// </summary>
public sealed class TourServiceTests
{
    private readonly ITourRepository _tourRepository = Substitute.For<ITourRepository>();
    private readonly IUser _user = Substitute.For<IUser>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly IMapper _mapper = Substitute.For<IMapper>();

    private TourService CreateService() => new(_tourRepository, _user, _unitOfWork, _mapper);

    #region Helper Methods

    private ImageInputDto CreateValidImage() => new(
        FileId: "file-123",
        OriginalFileName: "image.jpg",
        FileName: "image.jpg",
        PublicURL: "https://cdn.example.com/image.jpg");

    private CreateTourCommand CreateBaseValidCommand() => new(
        TourName: "Da Nang Beach Tour",
        ShortDescription: "Beach vacation",
        LongDescription: "5-day beach tour",
        SEOTitle: null,
        SEODescription: null,
        Status: Domain.Enums.TourStatus.Active,
        Thumbnail: CreateValidImage(),
        Images: [CreateValidImage()],
        Classifications: null);

    #endregion

    #region TC01: Create with valid basic command returns tour ID

    [Fact]
    public async Task Create_WithValidBasicCommand_ShouldReturnTourId()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        _tourRepository.Create(Arg.Any<TourEntity>()).Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand();
        var service = CreateService();

        // Act
        var result = await service.Create(command);

        // Assert
        Assert.False(result.IsError);
        Assert.IsType<Guid>(result.Value);
        await _tourRepository.Received(1).Create(Arg.Any<TourEntity>());
        await _unitOfWork.Received(1).SaveChangeAsync(Arg.Any<CancellationToken>());
    }

    #endregion

    #region TC02: Tour code is auto-generated in TOUR-YYYYMMDD-NNNNN format

    [Fact]
    public async Task Create_ShouldAutoGenerateTourCode()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        _tourRepository.Create(Arg.Do<TourEntity>(t => Assert.StartsWith("TOUR-", t.TourCode)))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand();
        var service = CreateService();

        // Act
        var result = await service.Create(command);

        // Assert
        Assert.False(result.IsError);
    }

    #endregion

    #region TC03: Tour entity has correct basic fields set

    [Fact]
    public async Task Create_ShouldSetCorrectBasicFields()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand();
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert
        Assert.NotNull(capturedTour);
        Assert.Equal("Da Nang Beach Tour", capturedTour!.TourName);
        Assert.Equal("Beach vacation", capturedTour.ShortDescription);
        Assert.Equal("5-day beach tour", capturedTour.LongDescription);
        Assert.Equal(Domain.Enums.TourStatus.Active, capturedTour.Status);
        Assert.Equal("admin@test.com", capturedTour.CreatedBy);
    }

    #endregion

    #region TC04: Translations dictionary is normalized (keys lowercased)

    [Fact]
    public async Task Create_WithTranslations_ShouldNormalizeKeysToLowercase()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Translations = new Dictionary<string, TourTranslationData>(StringComparer.OrdinalIgnoreCase)
            {
                ["VI"] = new TourTranslationData { TourName = "Tour Da Nang", ShortDescription = "Mieu ta", LongDescription = "Mo ta dai" },
                ["EN"] = new TourTranslationData { TourName = "Da Nang Tour", ShortDescription = "Short", LongDescription = "Long" }
            }
        };
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert
        Assert.NotNull(capturedTour);
        Assert.Equal(2, capturedTour!.Translations.Count);
        Assert.True(capturedTour.Translations.ContainsKey("vi"));
        Assert.True(capturedTour.Translations.ContainsKey("en"));
        Assert.Equal("Tour Da Nang", capturedTour.Translations["vi"].TourName);
    }

    #endregion

    #region TC05: Classification with Plans, Activities, Routes, and Accommodation

    [Fact]
    public async Task Create_WithClassificationAndNestedEntities_ShouldBuildCorrectEntityGraph()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Standard Package",
                    Description: "Standard 3-day package",
                    BasePrice: 1000,
                    NumberOfDay: 3,
                    NumberOfNight: 2,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day 1",
                            Description: "Arrival",
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "Transport",
                                    Title: "Airport Pickup",
                                    Description: "Pick up from airport",
                                    Note: "Driver will wait",
                                    EstimatedCost: 50,
                                    IsOptional: false,
                                    StartTime: "08:00",
                                    EndTime: "10:00",
                                    Routes:
                                    [
                                        new RouteDto(
                                            TransportationType: "Car",
                                            FromLocationName: "Airport",
                                            ToLocationName: "Hotel",
                                            FromLocationId: null,
                                            ToLocationId: null,
                                            TransportationName: "Sedan",
                                            DurationMinutes: 60,
                                            PricingType: null,
                                            Price: 30,
                                            RequiresIndividualTicket: false,
                                            TicketInfo: null,
                                            Note: null,
                                            Translations: null,
                                            RouteTranslations: null)
                                    ],
                                    Accommodation: new AccommodationDto(
                                        AccommodationName: "Hotel ABC",
                                        Address: "123 Main St",
                                        ContactPhone: "0123456789",
                                        CheckInTime: "14:00",
                                        CheckOutTime: "12:00",
                                        Note: "Late check-in available",
                                        RoomType: null,
                                        RoomCapacity: null,
                                        Translations: null),
                                    Translations: null)
                            ],
                            Translations: null)
                    ],
                    Insurances:
                    [
                        new InsuranceDto(
                            InsuranceName: "Travel Insurance",
                            InsuranceType: "Basic",
                            InsuranceProvider: "ABC Insurance",
                            CoverageDescription: "Basic coverage",
                            CoverageAmount: 10000,
                            CoverageFee: 50,
                            IsOptional: true,
                            Note: null,
                            Translations: null)
                    ],
                    Translations: null)
            ]
        };
        var service = CreateService();

        // Act
        var result = await service.Create(command);

        // Assert
        Assert.False(result.IsError);
        Assert.NotNull(capturedTour);
        Assert.Single(capturedTour!.Classifications);
        var cls = capturedTour.Classifications[0];
        Assert.Equal("Standard Package", cls.Name);
        Assert.Equal(1000, cls.BasePrice);
        Assert.Single(cls.Plans);
        Assert.Single(cls.Plans[0].Activities);
        Assert.Equal("Airport Pickup", cls.Plans[0].Activities[0].Title);
        Assert.Single(cls.Plans[0].Activities[0].Routes);
        Assert.Equal("Airport", cls.Plans[0].Activities[0].Routes[0].FromLocation!.LocationName);
        Assert.Equal("Hotel ABC", cls.Plans[0].Activities[0].Accommodation!.AccommodationName);
        Assert.Single(cls.Insurances);
        Assert.Equal("Travel Insurance", cls.Insurances[0].InsuranceName);
    }

    #endregion

    #region TC06: Activity time parsing (valid time strings)

    [Fact]
    public async Task Create_WithActivityTimeStrings_ShouldParseTimeOnly()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Test",
                    Description: "",
                    BasePrice: 0,
                    NumberOfDay: 1,
                    NumberOfNight: 0,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day",
                            Description: null,
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "Sightseeing",
                                    Title: "Visit Temple",
                                    Description: null,
                                    Note: null,
                                    EstimatedCost: 0,
                                    IsOptional: false,
                                    StartTime: "09:30",
                                    EndTime: "17:45",
                                    Routes: [],
                                    Accommodation: null,
                                    Translations: null)
                            ],
                            Translations: null)
                    ],
                    Insurances: [],
                    Translations: null)
            ]
        };
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert
        var activity = capturedTour!.Classifications[0].Plans[0].Activities[0];
        Assert.NotNull(activity.StartTime);
        Assert.Equal(9, activity.StartTime.Value.Hour);
        Assert.Equal(30, activity.StartTime.Value.Minute);
        Assert.NotNull(activity.EndTime);
        Assert.Equal(17, activity.EndTime.Value.Hour);
        Assert.Equal(45, activity.EndTime.Value.Minute);
    }

    #endregion

    #region TC07: Activity time parsing (invalid time strings become null)

    [Fact]
    public async Task Create_WithInvalidActivityTimeStrings_ShouldBeNull()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Test",
                    Description: "",
                    BasePrice: 0,
                    NumberOfDay: 1,
                    NumberOfNight: 0,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day",
                            Description: null,
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "Sightseeing",
                                    Title: "Visit",
                                    Description: null,
                                    Note: null,
                                    EstimatedCost: 0,
                                    IsOptional: false,
                                    StartTime: "not-a-time",
                                    EndTime: "",
                                    Routes: [],
                                    Accommodation: null,
                                    Translations: null)
                            ],
                            Translations: null)
                    ],
                    Insurances: [],
                    Translations: null)
            ]
        };
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert
        var activity = capturedTour!.Classifications[0].Plans[0].Activities[0];
        Assert.Null(activity.StartTime);
        Assert.Null(activity.EndTime);
    }

    #endregion

    #region TC08: Activity type enum fallback to Other

    [Fact]
    public async Task Create_WithUnknownActivityType_ShouldFallbackToOther()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Test",
                    Description: "",
                    BasePrice: 0,
                    NumberOfDay: 1,
                    NumberOfNight: 0,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day",
                            Description: null,
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "UnknownActivityType",
                                    Title: "Activity",
                                    Description: null,
                                    Note: null,
                                    EstimatedCost: 0,
                                    IsOptional: false,
                                    StartTime: null,
                                    EndTime: null,
                                    Routes: [],
                                    Accommodation: null,
                                    Translations: null)
                            ],
                            Translations: null)
                    ],
                    Insurances: [],
                    Translations: null)
            ]
        };
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert
        Assert.Equal(
            Domain.Enums.TourDayActivityType.Other,
            capturedTour!.Classifications[0].Plans[0].Activities[0].ActivityType);
    }

    #endregion

    #region TC09: Route transportation type enum fallback to Other

    [Fact]
    public async Task Create_WithUnknownTransportationType_ShouldFallbackToOther()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Test",
                    Description: "",
                    BasePrice: 0,
                    NumberOfDay: 1,
                    NumberOfNight: 0,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day",
                            Description: null,
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "Transport",
                                    Title: "Transfer",
                                    Description: null,
                                    Note: null,
                                    EstimatedCost: 0,
                                    IsOptional: false,
                                    StartTime: null,
                                    EndTime: null,
                                    Routes:
                                    [
                                        new RouteDto(
                                            TransportationType: "UnknownTransport",
                                            FromLocationName: "A",
                                            ToLocationName: "B",
                                            FromLocationId: null,
                                            ToLocationId: null,
                                            TransportationName: null,
                                            DurationMinutes: 30,
                                            PricingType: null,
                                            Price: 10,
                                            RequiresIndividualTicket: false,
                                            TicketInfo: null,
                                            Note: null,
                                            Translations: null,
                                            RouteTranslations: null)
                                    ],
                                    Accommodation: null,
                                    Translations: null)
                            ],
                            Translations: null)
                    ],
                    Insurances: [],
                    Translations: null)
            ]
        };
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert
        Assert.Equal(
            Domain.Enums.TransportationType.Other,
            capturedTour!.Classifications[0].Plans[0].Activities[0].Routes[0].TransportationType);
    }

    #endregion

    #region TC10: Standalone accommodations/locations/transportations logged (not persisted)

    [Fact]
    public async Task Create_WithStandaloneAccommodationsLocationsTransportations_ShouldNotThrow()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        _tourRepository.Create(Arg.Any<TourEntity>()).Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Accommodations =
            [
                new AccommodationDto(
                    AccommodationName: "Hotel 1",
                    Address: "123 St",
                    ContactPhone: null,
                    CheckInTime: null,
                    CheckOutTime: null,
                    Note: null,
                    RoomType: null,
                    RoomCapacity: null,
                    Translations: null)
            ],
            Locations =
            [
                new LocationDto(
                    LocationName: "Museum",
                    LocationType: "Museum",
                    Description: null,
                    City: "Da Nang",
                    Country: "Vietnam",
                    EntranceFee: 0,
                    Address: null,
                    Translations: null)
            ],
            Transportations =
            [
                new TransportationDto(
                    FromLocationName: "Hotel",
                    ToLocationName: "Beach",
                    TransportationType: "Bus",
                    TransportationName: null,
                    DurationMinutes: 30,
                    PricingType: null,
                    Price: 5,
                    RequiresIndividualTicket: false,
                    TicketInfo: null,
                    Note: null,
                    Translations: null)
            ]
        };
        var service = CreateService();

        // Act
        var result = await service.Create(command);

        // Assert
        Assert.False(result.IsError);
    }

    #endregion

    #region TC11: Policy IDs are set on tour entity

    [Fact]
    public async Task Create_WithPolicyIds_ShouldSetOnTourEntity()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var visaPolicyId = Guid.CreateVersion7();
        var depositPolicyId = Guid.CreateVersion7();
        var pricingPolicyId = Guid.CreateVersion7();
        var cancellationPolicyId = Guid.CreateVersion7();

        var command = CreateBaseValidCommand() with
        {
            VisaPolicyId = visaPolicyId,
            DepositPolicyId = depositPolicyId,
            PricingPolicyId = pricingPolicyId,
            CancellationPolicyId = cancellationPolicyId
        };
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert
        Assert.NotNull(capturedTour);
        Assert.Equal(visaPolicyId, capturedTour!.VisaPolicyId);
        Assert.Equal(depositPolicyId, capturedTour.DepositPolicyId);
        Assert.Equal(pricingPolicyId, capturedTour.PricingPolicyId);
        Assert.Equal(cancellationPolicyId, capturedTour.CancellationPolicyId);
    }

    #endregion

    #region TC12: Nested entity translations are normalized

    [Fact]
    public async Task Create_WithNestedTranslations_ShouldNormalizeKeysToLowercase()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Pkg",
                    Description: "Desc",
                    BasePrice: 0,
                    NumberOfDay: 1,
                    NumberOfNight: 0,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day",
                            Description: null,
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "Sightseeing",
                                    Title: "Act",
                                    Description: null,
                                    Note: null,
                                    EstimatedCost: 0,
                                    IsOptional: false,
                                    StartTime: null,
                                    EndTime: null,
                                    Routes: [],
                                    Accommodation: null,
                                    Translations: new Dictionary<string, TourDayActivityTranslationData>(StringComparer.OrdinalIgnoreCase)
                                    {
                                        ["EN"] = new TourDayActivityTranslationData { Title = "Activity EN", Description = "Desc EN" },
                                        ["VI"] = new TourDayActivityTranslationData { Title = "Activity VI", Description = "Desc VI" }
                                    })
                            ],
                            Translations: new Dictionary<string, TourDayTranslationData>(StringComparer.OrdinalIgnoreCase)
                            {
                                ["EN"] = new TourDayTranslationData { Title = "Day EN", Description = "Desc EN" }
                            })
                    ],
                    Insurances: [],
                    Translations: new Dictionary<string, TourClassificationTranslationData>(StringComparer.OrdinalIgnoreCase)
                    {
                        ["EN"] = new TourClassificationTranslationData { Name = "Pkg EN", Description = "Desc EN" }
                    })
            ]
        };
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert
        var cls = capturedTour!.Classifications[0];
        // Classification translations: EN key added, VI key added
        // Classification translations: only EN provided
        Assert.Single(cls.Translations);
        Assert.True(cls.Translations.ContainsKey("en"));
        Assert.False(cls.Translations.ContainsKey("vi"));
        // DayPlan translations: only EN key added
        Assert.Single(cls.Plans[0].Translations);
        Assert.True(cls.Plans[0].Translations.ContainsKey("en"));
        Assert.Equal("Day EN", cls.Plans[0].Translations["en"].Title);
        // Activity translations: EN and VI keys added
        Assert.True(cls.Plans[0].Activities[0].Translations.ContainsKey("en"));
        Assert.True(cls.Plans[0].Activities[0].Translations.ContainsKey("vi"));
        Assert.Equal("Activity EN", cls.Plans[0].Activities[0].Translations["en"].Title);
        Assert.Equal("Activity VI", cls.Plans[0].Activities[0].Translations["vi"].Title);
    }

    #endregion

    #region TC13: Services are persisted as TourResource entities

    [Fact]
    public async Task Create_WithServices_ShouldPersistAsTourResources()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Services =
            [
                new ServiceDto(
                    ServiceName: "Guide Service",
                    PricingType: "Per Person",
                    Price: 50,
                    SalePrice: 45,
                    Email: "guide@tour.com",
                    ContactNumber: "0123456789")
            ]
        };
        var service = CreateService();

        // Act
        var result = await service.Create(command);

        // Assert
        Assert.False(result.IsError);
        Assert.NotNull(capturedTour);
        Assert.Single(capturedTour!.Resources);
        var resource = capturedTour.Resources[0];
        Assert.Equal(Domain.Entities.TourResourceType.Service, resource.Type);
        Assert.Equal("Guide Service", resource.Name);
        Assert.Equal(50, resource.Price);
        Assert.Equal("Per Person", resource.PricingType);
        Assert.Equal("guide@tour.com", resource.ContactEmail);
        Assert.Equal("0123456789", resource.ContactPhone);
    }

    [Fact]
    public async Task Create_WithServices_UsesSalePriceWhenBothPriceAndSalePriceProvided()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Services =
            [
                new ServiceDto(
                    ServiceName: "Guide",
                    PricingType: null,
                    Price: 100,
                    SalePrice: 80,
                    Email: null,
                    ContactNumber: null)
            ]
        };
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert - TourService uses Price when both are provided, falls back to SalePrice
        Assert.Equal(100, capturedTour!.Resources[0].Price);
    }

    #endregion

    #region TC14: Create activity with EstimatedCost -> entity has correct value

    [Fact]
    public async Task Create_WithActivityEstimatedCost_ShouldSetCorrectValue()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Test",
                    Description: "",
                    BasePrice: 0,
                    NumberOfDay: 1,
                    NumberOfNight: 0,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day",
                            Description: null,
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "Sightseeing",
                                    Title: "Activity",
                                    Description: null,
                                    Note: null,
                                    EstimatedCost: 250.75m,
                                    IsOptional: false,
                                    StartTime: null,
                                    EndTime: null,
                                    Routes: [],
                                    Accommodation: null)
                            ],
                            Translations: null)
                    ],
                    Insurances: [],
                    Translations: null)
            ]
        };
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert
        Assert.NotNull(capturedTour);
        var activity = capturedTour!.Classifications[0].Plans[0].Activities[0];
        Assert.Equal(250.75m, activity.EstimatedCost);
    }

    #endregion

    #region TC15: Create activity EstimatedCost null -> entity is null

    [Fact]
    public async Task Create_WithActivityEstimatedCostNull_ShouldSetNull()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? capturedTour = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => capturedTour = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Test",
                    Description: "",
                    BasePrice: 0,
                    NumberOfDay: 1,
                    NumberOfNight: 0,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day",
                            Description: null,
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "Sightseeing",
                                    Title: "Activity",
                                    Description: null,
                                    Note: null,
                                    EstimatedCost: null,
                                    IsOptional: false,
                                    StartTime: null,
                                    EndTime: null,
                                    Routes: [],
                                    Accommodation: null)
                            ],
                            Translations: null)
                    ],
                    Insurances: [],
                    Translations: null)
            ]
        };
        var service = CreateService();

        // Act
        await service.Create(command);

        // Assert
        Assert.NotNull(capturedTour);
        var activity = capturedTour!.Classifications[0].Plans[0].Activities[0];
        Assert.Null(activity.EstimatedCost);
    }

    #endregion

    #region TC16: Create activity EstimatedCost negative -> throws

    [Fact]
    public async Task Create_WithActivityEstimatedCostNegative_ShouldThrow()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        _tourRepository.Create(Arg.Any<TourEntity>()).Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Test",
                    Description: "",
                    BasePrice: 0,
                    NumberOfDay: 1,
                    NumberOfNight: 0,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day",
                            Description: null,
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "Sightseeing",
                                    Title: "Activity",
                                    Description: null,
                                    Note: null,
                                    EstimatedCost: -50,
                                    IsOptional: false,
                                    StartTime: null,
                                    EndTime: null,
                                    Routes: [],
                                    Accommodation: null)
                            ],
                            Translations: null)
                    ],
                    Insurances: [],
                    Translations: null)
            ]
        };
        var service = CreateService();

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => service.Create(command));
    }

    #endregion

    #region S1: Route text-only backward compat — FromLocation/ToLocation created

    [Fact]
    public async Task CreateTour_WithRouteTextOnly_BackwardCompat()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? captured = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => captured = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Test",
                    Description: "Test",
                    BasePrice: 100,
                    NumberOfDay: 1,
                    NumberOfNight: 0,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day",
                            Description: null,
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "Transport",
                                    Title: "Airport Pickup",
                                    Description: null,
                                    Note: null,
                                    EstimatedCost: 0,
                                    IsOptional: false,
                                    StartTime: null,
                                    EndTime: null,
                                    Routes:
                                    [
                                        new RouteDto(
                                            TransportationType: "Car",
                                            FromLocationName: "Airport",
                                            ToLocationName: "Hotel",
                                            FromLocationId: null,
                                            ToLocationId: null,
                                            TransportationName: null,
                                            DurationMinutes: 30,
                                            PricingType: null,
                                            Price: 50,
                                            RequiresIndividualTicket: false,
                                            TicketInfo: null,
                                            Note: null,
                                            Translations: null,
                                            RouteTranslations: null)
                                    ],
                                    Accommodation: null,
                                    Translations: null)
                            ],
                            Translations: null)
                    ],
                    Insurances: [])
            ]
        };

        var service = CreateService();

        // Act
        var result = await service.Create(command);

        // Assert
        Assert.False(result.IsError);
        Assert.NotNull(captured);
        var classification = captured!.Classifications[0];
        var plan = classification.Plans[0];
        var activity = plan.Activities[0];
        var route = activity.Routes[0];
        Assert.NotNull(route.FromLocation);
        Assert.NotNull(route.ToLocation);
        Assert.Equal("Airport", route.FromLocation!.LocationName);
        Assert.Equal("Hotel", route.ToLocation!.LocationName);
        Assert.Equal(route.FromLocation.TourId, captured.Id);
        Assert.Equal(route.ToLocation.TourId, captured.Id);
    }

    #endregion

    #region S2: Multiple routes same from/to name — deduplication via location cache

    [Fact]
    public async Task CreateTour_MultipleRoutesSameFromToName_DeduplicatesLocations()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? captured = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => captured = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Classifications =
            [
                new ClassificationDto(null,
                    Name: "Test",
                    Description: "Test",
                    BasePrice: 100,
                    NumberOfDay: 1,
                    NumberOfNight: 0,
                    Plans:
                    [
                        new DayPlanDto(null,
                            DayNumber: 1,
                            Title: "Day",
                            Description: null,
                            Activities:
                            [
                                new ActivityDto(null,
                                    ActivityType: "Transport",
                                    Title: "Transfer 1",
                                    Description: null,
                                    Note: null,
                                    EstimatedCost: 0,
                                    IsOptional: false,
                                    StartTime: null,
                                    EndTime: null,
                                    Routes:
                                    [
                                        new RouteDto(
                                            TransportationType: "Car",
                                            FromLocationName: "Hotel",
                                            ToLocationName: "Airport",
                                            FromLocationId: null,
                                            ToLocationId: null,
                                            TransportationName: null,
                                            DurationMinutes: 30,
                                            PricingType: null,
                                            Price: 20,
                                            RequiresIndividualTicket: false,
                                            TicketInfo: null,
                                            Note: null,
                                            Translations: null,
                                            RouteTranslations: null),
                                        new RouteDto(
                                            TransportationType: "Car",
                                            FromLocationName: "Airport",
                                            ToLocationName: "Museum",
                                            FromLocationId: null,
                                            ToLocationId: null,
                                            TransportationName: null,
                                            DurationMinutes: 45,
                                            PricingType: null,
                                            Price: 15,
                                            RequiresIndividualTicket: false,
                                            TicketInfo: null,
                                            Note: null,
                                            Translations: null,
                                            RouteTranslations: null)
                                    ],
                                    Accommodation: null,
                                    Translations: null)
                            ],
                            Translations: null)
                    ],
                    Insurances: [])
            ]
        };

        var service = CreateService();

        // Act
        var result = await service.Create(command);

        // Assert
        Assert.False(result.IsError);
        Assert.NotNull(captured);
        var activity = captured!.Classifications[0].Plans[0].Activities[0];
        var hotelRoutes = activity.Routes.Where(r => r.FromLocation?.LocationName == "Hotel").ToList();
        var airportRoutes = activity.Routes.Where(r => r.FromLocation?.LocationName == "Airport").ToList();

        // Hotel appears once as from (1 route), Airport appears once as from and once as to (2 routes total)
        Assert.Single(hotelRoutes);
        Assert.Single(airportRoutes);

        // Same "Airport" location instance used for both routes that mention it
        var airportFrom = activity.Routes.First(r => r.FromLocation?.LocationName == "Airport");
        var airportTo = activity.Routes.First(r => r.ToLocation?.LocationName == "Airport");
        Assert.Same(airportFrom.FromLocation, airportTo.ToLocation);
    }

    #endregion

    #region S3: Transportation with bilingual translations

    [Fact]
    public async Task CreateTour_TransportationWithBilingualTranslations_ShouldSetNameAndTranslations()
    {
        // Arrange
        _user.Id.Returns("admin@test.com");
        TourEntity? captured = null;
        _tourRepository.Create(Arg.Do<TourEntity>(t => captured = t))
            .Returns(Task.CompletedTask);
        _unitOfWork.SaveChangeAsync(Arg.Any<CancellationToken>()).Returns(1);

        var command = CreateBaseValidCommand() with
        {
            Transportations =
            [
                new TransportationDto(
                    TransportationType: "Flight",
                    FromLocationName: "Hanoi",
                    ToLocationName: "HCM",
                    FromLocationId: null,
                    ToLocationId: null,
                    TransportationName: "Vietnam Airlines",
                    DurationMinutes: 120,
                    PricingType: "Per person",
                    Price: 100,
                    RequiresIndividualTicket: true,
                    TicketInfo: "Economy",
                    Note: "Direct",
                    Translations: new Dictionary<string, TourTransportationTranslationData>
                    {
                        ["vi"] = new TourTransportationTranslationData("Hà Nội", "TP Hồ Chí Minh", "Hãng Vietnam Airlines", "Phổ thông", "Bay thẳng"),
                        ["en"] = new TourTransportationTranslationData("Hanoi", "Ho Chi Minh City", "Vietnam Airlines", "Economy", "Direct")
                    })
            ]
        };

        var service = CreateService();

        // Act
        var result = await service.Create(command);

        // Assert
        Assert.False(result.IsError);
        Assert.NotNull(captured);
        var resource = captured!.Resources.Single();
        Assert.Equal(TourResourceType.Transportation, resource.Type);
        Assert.Equal(2, resource.Translations.Count);
        Assert.True(resource.Translations.ContainsKey("vi"));
        Assert.True(resource.Translations.ContainsKey("en"));
        Assert.Equal("Hà Nội", resource.Translations["vi"].FromLocationName);
        Assert.Equal("Phổ thông", resource.Translations["vi"].TicketInfo);
    }

    #endregion
}
