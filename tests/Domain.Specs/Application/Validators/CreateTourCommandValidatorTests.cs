using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Features.Tour.Validators;
using Domain.Enums;

namespace Domain.Specs.Application.Validators;

/// <summary>
/// Comprehensive test cases for CreateTourCommand covering ALL properties
/// Including: Thumbnail, Images, Classifications, Translations
/// Following FPT template: N (Normal), A (Abnormal), B (Boundary)
/// </summary>
public class CreateTourCommandValidatorTests
{
    private readonly CreateTourCommandValidator _validator = new();

    #region Helper Methods

    private CreateTourCommand CreateValidCommand() => new(
        TourName: "Tour name",
        ShortDescription: "Short desc",
        LongDescription: "Long desc",
        SEOTitle: null,
        SEODescription: null,
        Status: TourStatus.Active);

    private string CreateString(int length) => new('A', length);

    // Valid Image Input DTO
    private ImageInputDto CreateValidImage() => new(
        FileId: "file-123",
        OriginalFileName: "image.jpg",
        FileName: "image.jpg",
        PublicURL: "https://cdn.example.com/image.jpg");

    // Valid Classification DTO
    private ClassificationDto CreateValidClassification() => new(
        Name: "Standard Tour",
        Description: "Standard package",
        AdultPrice: 1000,
        ChildPrice: 500,
        InfantPrice: 100,
        NumberOfDay: 3,
        NumberOfNight: 2,
        Plans: [],
        Insurances: []);

    // Valid DayPlan DTO
    private DayPlanDto CreateValidDayPlan() => new(
        DayNumber: 1,
        Title: "Day 1 Title",
        Description: "Day 1 description",
        Activities: []);

    // Valid Activity DTO
    private ActivityDto CreateValidActivity() => new(
        ActivityType: "Sightseeing",
        Title: "Visit Temple",
        Description: "Visit ancient temple",
        Note: null,
        EstimatedCost: 50,
        IsOptional: false,
        StartTime: "09:00",
        EndTime: "12:00",
        Routes: [],
        Accommodation: null);

    // Valid Accommodation DTO
    private AccommodationDto CreateValidAccommodation() => new(
        AccommodationName: "Hotel ABC",
        Address: "123 Main St",
        ContactPhone: "0123456789",
        CheckInTime: "14:00",
        CheckOutTime: "12:00",
        Note: null);

    // Valid Route DTO
    private RouteDto CreateValidRoute() => new(
        FromLocationName: "Hotel",
        ToLocationName: "Temple",
        TransportationType: "Bus",
        TransportationName: "City Bus",
        DurationMinutes: 60,
        PricingType: "PerPerson",
        Price: 20,
        RequiresIndividualTicket: false,
        TicketInfo: null,
        Note: null);

    // Valid Insurance DTO
    private InsuranceDto CreateValidInsurance() => new(
        InsuranceName: "Travel Insurance",
        InsuranceType: "Basic",
        InsuranceProvider: "ABC Insurance",
        CoverageDescription: "Basic coverage",
        CoverageAmount: 10000,
        CoverageFee: 50,
        IsOptional: true,
        Note: null);

    #endregion

    #region === BASIC STRING FIELDS ===

    #region TC01: All Valid - Normal Case

    [Fact]
    public void Validate_TC01_AllBasicFieldsValid_ShouldPass()
    {
        // Arrange
        var command = new CreateTourCommand(
            TourName: "Tour name",
            ShortDescription: "Short desc",
            LongDescription: "Long desc",
            SEOTitle: null,
            SEODescription: null,
            Status: TourStatus.Active);

        // Act
        var result = _validator.Validate(command);

        // Assert
        Assert.True(result.IsValid, string.Join(", ", result.Errors.Select(e => e.ErrorMessage)));
    }

    #endregion

    #region TC02: TourName Empty - Abnormal

    [Fact]
    public void Validate_TC02_TourNameEmpty_ShouldFail()
    {
        var command = CreateValidCommand() with { TourName = "" };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "TourName");
    }

    #endregion

    #region TC03: TourName Max Characters - Boundary

    [Fact]
    public void Validate_TC03_TourNameMaxChars_ShouldPass()
    {
        var command = CreateValidCommand() with { TourName = CreateString(500) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC04: ShortDescription Empty - Abnormal

    [Fact]
    public void Validate_TC04_ShortDescriptionEmpty_ShouldFail()
    {
        var command = CreateValidCommand() with { ShortDescription = "" };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "ShortDescription");
    }

    #endregion

    #region TC05: ShortDescription Max Characters - Boundary

    [Fact]
    public void Validate_TC05_ShortDescriptionMaxChars_ShouldPass()
    {
        var command = CreateValidCommand() with { ShortDescription = CreateString(250) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC06: LongDescription Empty - Abnormal

    [Fact]
    public void Validate_TC06_LongDescriptionEmpty_ShouldFail()
    {
        var command = CreateValidCommand() with { LongDescription = "" };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "LongDescription");
    }

    #endregion

    #region TC07: LongDescription Max Characters - Boundary

    [Fact]
    public void Validate_TC07_LongDescriptionMaxChars_ShouldPass()
    {
        var command = CreateValidCommand() with { LongDescription = CreateString(5000) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC08: Invalid Status - Abnormal

    [Fact]
    public void Validate_TC08_InvalidStatus_ShouldFail()
    {
        var command = CreateValidCommand() with { Status = (TourStatus)999 };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Status");
    }

    #endregion

    #endregion

    #region === THUMBNAIL (ImageInputDto) ===

    #region TC09: Thumbnail Valid - Normal

    [Fact]
    public void Validate_TC09_ThumbnailValid_ShouldPass()
    {
        var command = CreateValidCommand() with
        {
            Thumbnail = CreateValidImage()
        };

        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC10: Thumbnail FileId Empty - Abnormal

    [Fact]
    public void Validate_TC10_ThumbnailFileIdEmpty_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Thumbnail = new ImageInputDto(
                FileId: "",
                OriginalFileName: "image.jpg",
                FileName: "image.jpg",
                PublicURL: "https://cdn.example.com/image.jpg")
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Thumbnail.FileId");
    }

    #endregion

    #region TC11: Thumbnail Invalid URL - Abnormal

    [Fact]
    public void Validate_TC11_ThumbnailInvalidURL_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Thumbnail = new ImageInputDto(
                FileId: "file-123",
                OriginalFileName: "image.jpg",
                FileName: "image.jpg",
                PublicURL: "not-a-valid-url")
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Thumbnail.PublicURL");
    }

    #endregion

    #region TC12: Thumbnail Null - Normal (Optional)

    [Fact]
    public void Validate_TC12_ThumbnailNull_ShouldPass()
    {
        var command = CreateValidCommand() with { Thumbnail = null };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #endregion

    #region === IMAGES (List<ImageInputDto>) ===

    #region TC13: Images Valid - Normal

    [Fact]
    public void Validate_TC13_ImagesValid_ShouldPass()
    {
        var command = CreateValidCommand() with
        {
            Images = [CreateValidImage(), CreateValidImage()]
        };

        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC14: Images With Invalid FileId - Abnormal

    [Fact]
    public void Validate_TC14_ImagesInvalidFileId_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Images = [new ImageInputDto(
                FileId: "",
                OriginalFileName: "image.jpg",
                FileName: "image.jpg",
                PublicURL: "https://cdn.example.com/image.jpg")]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("Images"));
    }

    #endregion

    #region TC15: Images Null - Normal (Optional)

    [Fact]
    public void Validate_TC15_ImagesNull_ShouldPass()
    {
        var command = CreateValidCommand() with { Images = null };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #endregion

    #region === CLASSIFICATIONS (List<ClassificationDto>) ===

    #region TC16: Classifications Valid - Normal

    [Fact]
    public void Validate_TC16_ClassificationsValid_ShouldPass()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [CreateValidClassification()]
        };

        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC17: Classification Name Empty - Abnormal

    [Fact]
    public void Validate_TC17_ClassificationNameEmpty_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("Classifications"));
    }

    #endregion

    #region TC18: Classification AdultPrice Negative - Abnormal

    [Fact]
    public void Validate_TC18_ClassificationNegativePrice_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: -100,  // Negative!
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("AdultPrice"));
    }

    #endregion

    #region TC19: Classification NumberOfDay Zero - Abnormal

    [Fact]
    public void Validate_TC19_ClassificationZeroDays_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 0,  // Zero!
                NumberOfNight: 2,
                Plans: [],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("NumberOfDay"));
    }

    #endregion

    #region TC20: Classification Max Name Length - Boundary

    [Fact]
    public void Validate_TC20_ClassificationMaxName_ShouldPass()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: CreateString(200),  // Max 200
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC21: Classifications Null - Normal (Optional)

    [Fact]
    public void Validate_TC21_ClassificationsNull_ShouldPass()
    {
        var command = CreateValidCommand() with { Classifications = null };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #endregion

    #region === NESTED: DAY PLAN ===

    #region TC22: DayPlan Valid - Normal

    [Fact]
    public void Validate_TC22_DayPlanValid_ShouldPass()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [CreateValidDayPlan()],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC23: DayPlan Title Empty - Abnormal

    [Fact]
    public void Validate_TC23_DayPlanTitleEmpty_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 1,
                    Title: "",  // Empty!
                    Description: "Description",
                    Activities: [])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("Title"));
    }

    #endregion

    #region TC24: DayPlan Zero - Abnormal

    [Fact]
    public void Validate_TC24_DayPlanZero_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 0,  // Zero!
                    Title: "Title",
                    Description: "Description",
                    Activities: [])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("DayNumber"));
    }

    #endregion

    #endregion

    #region === NESTED: ACTIVITY ===

    #region TC25: Activity Valid - Normal

    [Fact]
    public void Validate_TC25_ActivityValid_ShouldPass()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 1,
                    Title: "Day 1",
                    Description: "Description",
                    Activities: [CreateValidActivity()])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC26: Activity Type Empty - Abnormal

    [Fact]
    public void Validate_TC26_ActivityTypeEmpty_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 1,
                    Title: "Day 1",
                    Description: "Description",
                    Activities: [new ActivityDto(
                        ActivityType: "",  // Empty!
                        Title: "Activity",
                        Description: null,
                        Note: null,
                        EstimatedCost: null,
                        IsOptional: false,
                        StartTime: null,
                        EndTime: null,
                        Routes: [],
                        Accommodation: null)])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("ActivityType"));
    }

    #endregion

    #region TC27: Activity Negative Cost - Abnormal

    [Fact]
    public void Validate_TC27_ActivityNegativeCost_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 1,
                    Title: "Day 1",
                    Description: "Description",
                    Activities: [new ActivityDto(
                        ActivityType: "Sightseeing",
                        Title: "Activity",
                        Description: null,
                        Note: null,
                        EstimatedCost: -50,  // Negative!
                        IsOptional: false,
                        StartTime: null,
                        EndTime: null,
                        Routes: [],
                        Accommodation: null)])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("EstimatedCost"));
    }

    #endregion

    #endregion

    #region === NESTED: ACCOMMODATION ===

    #region TC28: Accommodation Valid - Normal

    [Fact]
    public void Validate_TC28_AccommodationValid_ShouldPass()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 1,
                    Title: "Day 1",
                    Description: "Description",
                    Activities: [new ActivityDto(
                        ActivityType: "Sightseeing",
                        Title: "Activity",
                        Description: null,
                        Note: null,
                        EstimatedCost: null,
                        IsOptional: false,
                        StartTime: null,
                        EndTime: null,
                        Routes: [],
                        Accommodation: CreateValidAccommodation())])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC29: Accommodation Name Empty - Abnormal

    [Fact]
    public void Validate_TC29_AccommodationNameEmpty_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 1,
                    Title: "Day 1",
                    Description: "Description",
                    Activities: [new ActivityDto(
                        ActivityType: "Sightseeing",
                        Title: "Activity",
                        Description: null,
                        Note: null,
                        EstimatedCost: null,
                        IsOptional: false,
                        StartTime: null,
                        EndTime: null,
                        Routes: [],
                        Accommodation: new AccommodationDto(
                            AccommodationName: "",  // Empty!
                            Address: null,
                            ContactPhone: null,
                            CheckInTime: null,
                            CheckOutTime: null,
                            Note: null))])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("AccommodationName"));
    }

    #endregion

    #region TC30: Accommodation Invalid Phone - Abnormal

    [Fact]
    public void Validate_TC30_AccommodationInvalidPhone_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 1,
                    Title: "Day 1",
                    Description: "Description",
                    Activities: [new ActivityDto(
                        ActivityType: "Sightseeing",
                        Title: "Activity",
                        Description: null,
                        Note: null,
                        EstimatedCost: null,
                        IsOptional: false,
                        StartTime: null,
                        EndTime: null,
                        Routes: [],
                        Accommodation: new AccommodationDto(
                            AccommodationName: "Hotel ABC",
                            Address: null,
                            ContactPhone: "invalid-phone!",  // Invalid!
                            CheckInTime: null,
                            CheckOutTime: null,
                            Note: null))])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("ContactPhone"));
    }

    #endregion

    #endregion

    #region === NESTED: ROUTE ===

    #region TC31: Route Valid - Normal

    [Fact]
    public void Validate_TC31_RouteValid_ShouldPass()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 1,
                    Title: "Day 1",
                    Description: "Description",
                    Activities: [new ActivityDto(
                        ActivityType: "Sightseeing",
                        Title: "Activity",
                        Description: null,
                        Note: null,
                        EstimatedCost: null,
                        IsOptional: false,
                        StartTime: null,
                        EndTime: null,
                        Routes: [CreateValidRoute()],
                        Accommodation: null)])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC32: Route FromLocation Empty - Abnormal

    [Fact]
    public void Validate_TC32_RouteFromLocationEmpty_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 1,
                    Title: "Day 1",
                    Description: "Description",
                    Activities: [new ActivityDto(
                        ActivityType: "Sightseeing",
                        Title: "Activity",
                        Description: null,
                        Note: null,
                        EstimatedCost: null,
                        IsOptional: false,
                        StartTime: null,
                        EndTime: null,
                        Routes: [new RouteDto(
                            FromLocationName: "",  // Empty!
                            ToLocationName: "Temple",
                            TransportationType: "Bus",
                            TransportationName: null,
                            DurationMinutes: 60,
                            PricingType: null,
                            Price: null,
                            RequiresIndividualTicket: false,
                            TicketInfo: null,
                            Note: null)],
                        Accommodation: null)])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("FromLocationName"));
    }

    #endregion

    #region TC33: Route Negative Duration - Abnormal

    [Fact]
    public void Validate_TC33_RouteNegativeDuration_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [new DayPlanDto(
                    DayNumber: 1,
                    Title: "Day 1",
                    Description: "Description",
                    Activities: [new ActivityDto(
                        ActivityType: "Sightseeing",
                        Title: "Activity",
                        Description: null,
                        Note: null,
                        EstimatedCost: null,
                        IsOptional: false,
                        StartTime: null,
                        EndTime: null,
                        Routes: [new RouteDto(
                            FromLocationName: "Hotel",
                            ToLocationName: "Temple",
                            TransportationType: "Bus",
                            TransportationName: null,
                            DurationMinutes: -10,  // Negative!
                            PricingType: null,
                            Price: null,
                            RequiresIndividualTicket: false,
                            TicketInfo: null,
                            Note: null)],
                        Accommodation: null)])],
                Insurances: [])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("DurationMinutes"));
    }

    #endregion

    #endregion

    #region === NESTED: INSURANCE ===

    #region TC34: Insurance Valid - Normal

    [Fact]
    public void Validate_TC34_InsuranceValid_ShouldPass()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [],
                Insurances: [CreateValidInsurance()])
            ]
        };

        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC35: Insurance Name Empty - Abnormal

    [Fact]
    public void Validate_TC35_InsuranceNameEmpty_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [],
                Insurances: [new InsuranceDto(
                    InsuranceName: "",  // Empty!
                    InsuranceType: "Basic",
                    InsuranceProvider: "Provider",
                    CoverageDescription: "Coverage",
                    CoverageAmount: 10000,
                    CoverageFee: 50,
                    IsOptional: true,
                    Note: null)])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("InsuranceName"));
    }

    #endregion

    #region TC36: Insurance Negative Fee - Abnormal

    [Fact]
    public void Validate_TC36_InsuranceNegativeFee_ShouldFail()
    {
        var command = CreateValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 3,
                NumberOfNight: 2,
                Plans: [],
                Insurances: [new InsuranceDto(
                    InsuranceName: "Insurance",
                    InsuranceType: "Basic",
                    InsuranceProvider: "Provider",
                    CoverageDescription: "Coverage",
                    CoverageAmount: 10000,
                    CoverageFee: -50,  // Negative!
                    IsOptional: true,
                    Note: null)])
            ]
        };

        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("CoverageFee"));
    }

    #endregion

    #endregion

    #region === SEO FIELDS ===

    #region TC37: SEOTitle Max - Boundary

    [Fact]
    public void Validate_TC37_SEOTitleMax_ShouldPass()
    {
        var command = CreateValidCommand() with { SEOTitle = CreateString(70) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC38: SEOTitle Exceeds Max - Abnormal

    [Fact]
    public void Validate_TC38_SEOTitleExceedsMax_ShouldFail()
    {
        var command = CreateValidCommand() with { SEOTitle = CreateString(71) };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "SEOTitle");
    }

    #endregion

    #region TC39: SEODescription Max - Boundary

    [Fact]
    public void Validate_TC39_SEODescriptionMax_ShouldPass()
    {
        var command = CreateValidCommand() with { SEODescription = CreateString(320) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC40: SEODescription Exceeds Max - Abnormal

    [Fact]
    public void Validate_TC40_SEODescriptionExceedsMax_ShouldFail()
    {
        var command = CreateValidCommand() with { SEODescription = CreateString(321) };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "SEODescription");
    }

    #endregion

    #endregion
}
