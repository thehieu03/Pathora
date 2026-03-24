using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Features.Tour.Validators;
using Domain.Enums;

namespace Domain.Specs.Application.Validators;

/// <summary>
/// Comprehensive test cases for CreateTourCommand covering ALL properties
/// Following FPT template: N (Normal), A (Abnormal), B (Boundary)
/// </summary>
public class CreateTourCommandValidatorTests
{
    private readonly CreateTourCommandValidator _validator = new();

    #region Helper Methods

    private string CreateString(int length) => new('A', length);

    private ImageInputDto CreateValidImage(string fileId = "file-123") => new(
        FileId: fileId,
        OriginalFileName: "image.jpg",
        FileName: "image.jpg",
        PublicURL: "https://cdn.example.com/image.jpg");

    private CreateTourCommand CreateBaseValidCommand() => new(
        TourName: "Da Nang Beach Tour",
        ShortDescription: "Beach vacation",
        LongDescription: "5-day beach tour",
        SEOTitle: null,
        SEODescription: null,
        Status: TourStatus.Active,
        Thumbnail: CreateValidImage(),
        Images: [CreateValidImage("img-1")],
        Classifications: null);

    #endregion

    #region TC01: All Valid - Normal

    [Fact]
    public void Validate_TC01_AllBasicFieldsValid_ShouldPass()
    {
        var command = CreateBaseValidCommand();
        var result = _validator.Validate(command);
        Assert.True(result.IsValid, string.Join(", ", result.Errors.Select(e => e.ErrorMessage)));
    }

    #endregion

    #region TC02: TourName Empty - Abnormal

    [Fact]
    public void Validate_TC02_TourNameEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { TourName = "" };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "TourName");
    }

    #endregion

    #region TC03: TourName Max 500 - Boundary

    [Fact]
    public void Validate_TC03_TourNameMaxChars_ShouldPass()
    {
        var command = CreateBaseValidCommand() with { TourName = CreateString(500) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC04: ShortDescription Empty - Abnormal

    [Fact]
    public void Validate_TC04_ShortDescriptionEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { ShortDescription = "" };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "ShortDescription");
    }

    #endregion

    #region TC05: ShortDescription Max 250 - Boundary

    [Fact]
    public void Validate_TC05_ShortDescriptionMaxChars_ShouldPass()
    {
        var command = CreateBaseValidCommand() with { ShortDescription = CreateString(250) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC06: LongDescription Empty - Abnormal

    [Fact]
    public void Validate_TC06_LongDescriptionEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { LongDescription = "" };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "LongDescription");
    }

    #endregion

    #region TC07: LongDescription Max 5000 - Boundary

    [Fact]
    public void Validate_TC07_LongDescriptionMaxChars_ShouldPass()
    {
        var command = CreateBaseValidCommand() with { LongDescription = CreateString(5000) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC08: Invalid Status - Abnormal

    [Fact]
    public void Validate_TC08_InvalidStatus_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { Status = (TourStatus)999 };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Status");
    }

    #endregion

    #region TC09: Thumbnail Required - Abnormal

    [Fact]
    public void Validate_TC09_ThumbnailNull_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { Thumbnail = null };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Thumbnail");
    }

    #endregion

    #region TC10: Thumbnail Valid - Normal

    [Fact]
    public void Validate_TC10_ThumbnailValid_ShouldPass()
    {
        var command = CreateBaseValidCommand();
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC11: Thumbnail FileId Empty - Abnormal

    [Fact]
    public void Validate_TC11_ThumbnailFileIdEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
        {
            Thumbnail = new ImageInputDto(
                FileId: "",
                OriginalFileName: "image.jpg",
                FileName: "image.jpg",
                PublicURL: "https://cdn.example.com/image.jpg")
        };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("Thumbnail"));
    }

    #endregion

    #region TC12: Thumbnail Invalid URL - Abnormal

    [Fact]
    public void Validate_TC12_ThumbnailInvalidURL_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
        {
            Thumbnail = new ImageInputDto(
                FileId: "file-123",
                OriginalFileName: "image.jpg",
                FileName: "image.jpg",
                PublicURL: "not-a-valid-url")
        };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("PublicURL"));
    }

    #endregion

    #region TC13: Images Required - Abnormal

    [Fact]
    public void Validate_TC13_ImagesNull_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { Images = null };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Images");
    }

    #endregion

    #region TC14: Images Empty List - Abnormal

    [Fact]
    public void Validate_TC14_ImagesEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { Images = [] };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Images");
    }

    #endregion

    #region TC15: Images Valid - Normal

    [Fact]
    public void Validate_TC15_ImagesValid_ShouldPass()
    {
        var command = CreateBaseValidCommand() with
        {
            Images = [CreateValidImage("img-1"), CreateValidImage("img-2")]
        };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC16: Images Invalid FileId - Abnormal

    [Fact]
    public void Validate_TC16_ImagesInvalidFileId_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
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

    #region TC17: Classification Valid - Normal

    [Fact]
    public void Validate_TC17_ClassificationValid_ShouldPass()
    {
        var command = CreateBaseValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard Tour",
                Description: "Standard package",
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

    #region TC18: Classification Name Empty - Abnormal

    [Fact]
    public void Validate_TC18_ClassificationNameEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
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

    #region TC19: Classification Negative Price - Abnormal

    [Fact]
    public void Validate_TC19_ClassificationNegativePrice_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: -100,
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

    #region TC20: Classification Zero Days - Abnormal

    [Fact]
    public void Validate_TC20_ClassificationZeroDays_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
        {
            Classifications = [new ClassificationDto(
                Name: "Standard",
                Description: "Description",
                AdultPrice: 1000,
                ChildPrice: 500,
                InfantPrice: 100,
                NumberOfDay: 0,
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

    #region TC21: DayPlan Valid - Normal

    [Fact]
    public void Validate_TC21_DayPlanValid_ShouldPass()
    {
        var command = CreateBaseValidCommand() with
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
                    Title: "Day 1 Title",
                    Description: "Day 1 description",
                    Activities: [])],
                Insurances: [])
            ]
        };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC22: DayPlan Title Empty - Abnormal

    [Fact]
    public void Validate_TC22_DayPlanTitleEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
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
                    Title: "",
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

    #region TC23: Activity Valid - Normal

    [Fact]
    public void Validate_TC23_ActivityValid_ShouldPass()
    {
        var command = CreateBaseValidCommand() with
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
                        Title: "Visit Temple",
                        Description: "Visit ancient temple",
                        Note: null,
                        EstimatedCost: 50,
                        IsOptional: false,
                        StartTime: "09:00",
                        EndTime: "12:00",
                        Routes: [],
                        Accommodation: null)])],
                Insurances: [])
            ]
        };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC24: Activity Type Empty - Abnormal

    [Fact]
    public void Validate_TC24_ActivityTypeEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
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
                        ActivityType: "",
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

    #region TC25: Accommodation Valid - Normal

    [Fact]
    public void Validate_TC25_AccommodationValid_ShouldPass()
    {
        var command = CreateBaseValidCommand() with
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
                            Address: "123 Main St",
                            ContactPhone: "0123456789",
                            CheckInTime: "14:00",
                            CheckOutTime: "12:00",
                            Note: null))])],
                Insurances: [])
            ]
        };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC26: Accommodation Name Empty - Abnormal

    [Fact]
    public void Validate_TC26_AccommodationNameEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
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
                            AccommodationName: "",
                            Address: "123 Main St",
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

    #region TC27: Accommodation Invalid Phone - Abnormal

    [Fact]
    public void Validate_TC27_AccommodationInvalidPhone_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
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
                            ContactPhone: "invalid-phone!",
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

    #region TC28: Route Valid - Normal

    [Fact]
    public void Validate_TC28_RouteValid_ShouldPass()
    {
        var command = CreateBaseValidCommand() with
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
                            DurationMinutes: 60,
                            PricingType: null,
                            Price: 20,
                            RequiresIndividualTicket: false,
                            TicketInfo: null,
                            Note: null)],
                        Accommodation: null)])],
                Insurances: [])
            ]
        };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC29: Route FromLocation Empty - Abnormal

    [Fact]
    public void Validate_TC29_RouteFromLocationEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
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
                            FromLocationName: "",
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

    #region TC30: Route Negative Duration - Abnormal

    [Fact]
    public void Validate_TC30_RouteNegativeDuration_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
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
                            DurationMinutes: -10,
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

    #region TC31: Insurance Valid - Normal

    [Fact]
    public void Validate_TC31_InsuranceValid_ShouldPass()
    {
        var command = CreateBaseValidCommand() with
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
                    InsuranceName: "Travel Insurance",
                    InsuranceType: "Basic",
                    InsuranceProvider: "ABC Insurance",
                    CoverageDescription: "Basic coverage",
                    CoverageAmount: 10000,
                    CoverageFee: 50,
                    IsOptional: true,
                    Note: null)])
            ]
        };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC32: Insurance Name Empty - Abnormal

    [Fact]
    public void Validate_TC32_InsuranceNameEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
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
                    InsuranceName: "",
                    InsuranceType: "Basic",
                    InsuranceProvider: "ABC Insurance",
                    CoverageDescription: "Basic coverage",
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

    #region TC33: Insurance Negative Fee - Abnormal

    [Fact]
    public void Validate_TC33_InsuranceNegativeFee_ShouldFail()
    {
        var command = CreateBaseValidCommand() with
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
                    InsuranceProvider: "ABC Insurance",
                    CoverageDescription: "Basic coverage",
                    CoverageAmount: 10000,
                    CoverageFee: -50,
                    IsOptional: true,
                    Note: null)])
            ]
        };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName.Contains("CoverageFee"));
    }

    #endregion

    #region TC34: SEOTitle Max 70 - Boundary

    [Fact]
    public void Validate_TC34_SEOTitleMax_ShouldPass()
    {
        var command = CreateBaseValidCommand() with { SEOTitle = CreateString(70) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC35: SEOTitle Exceeds 70 - Abnormal

    [Fact]
    public void Validate_TC35_SEOTitleExceedsMax_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { SEOTitle = CreateString(71) };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "SEOTitle");
    }

    #endregion

    #region TC36: SEODescription Max 320 - Boundary

    [Fact]
    public void Validate_TC36_SEODescriptionMax_ShouldPass()
    {
        var command = CreateBaseValidCommand() with { SEODescription = CreateString(320) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC37: SEODescription Exceeds 320 - Abnormal

    [Fact]
    public void Validate_TC37_SEODescriptionExceedsMax_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { SEODescription = CreateString(321) };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "SEODescription");
    }

    #endregion

    #region TC38: TourName Exceeds 500 - Abnormal

    [Fact]
    public void Validate_TC38_TourNameExceeds500_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { TourName = CreateString(501) };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "TourName");
    }

    #endregion

    #region TC39: ShortDescription Exceeds 250 - Abnormal

    [Fact]
    public void Validate_TC39_ShortDescriptionExceeds250_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { ShortDescription = CreateString(251) };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "ShortDescription");
    }

    #endregion

    #region TC40: LongDescription Exceeds 5000 - Abnormal

    [Fact]
    public void Validate_TC40_LongDescriptionExceeds5000_ShouldFail()
    {
        var command = CreateBaseValidCommand() with { LongDescription = CreateString(5001) };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "LongDescription");
    }

    #endregion
}
