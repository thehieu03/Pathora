using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Features.Tour.Validators;
using Domain.Enums;

namespace Domain.Specs.Application.Validators;

public class UpdateTourCommandValidatorTests
{
    private readonly UpdateTourCommandValidator _validator = new();

    private static string CreateString(int length) => new('A', length);

    private static ImageInputDto CreateValidImage(string fileId = "file-123") => new(
        FileId: fileId,
        OriginalFileName: "image.jpg",
        FileName: "image.jpg",
        PublicURL: "https://cdn.example.com/image.jpg");

    private static UpdateTourCommand CreateBaseValidCommand(Guid id) => new(
        Id: id,
        TourName: "Da Nang Beach Tour",
        ShortDescription: "Beach vacation",
        LongDescription: "5-day beach tour",
        SEOTitle: null,
        SEODescription: null,
        Status: TourStatus.Active,
        Thumbnail: CreateValidImage(),
        Images: [CreateValidImage("img-1")],
        Translations: null);

    #region TC01: All Valid - Normal

    [Fact]
    public void Validate_TC01_AllBasicFieldsValid_ShouldPass()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid());
        var result = _validator.Validate(command);
        Assert.True(result.IsValid, string.Join(", ", result.Errors.Select(e => e.ErrorMessage)));
    }

    #endregion

    #region TC02: Id Empty - Abnormal

    [Fact]
    public void Validate_TC02_IdEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand(Guid.Empty);
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Id");
    }

    #endregion

    #region TC03: TourName Empty - Abnormal

    [Fact]
    public void Validate_TC03_TourNameEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { TourName = "" };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "TourName");
    }

    #endregion

    #region TC04: TourName Max 500 - Boundary

    [Fact]
    public void Validate_TC04_TourNameMaxChars_ShouldPass()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { TourName = CreateString(500) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC05: ShortDescription Empty - Abnormal

    [Fact]
    public void Validate_TC05_ShortDescriptionEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { ShortDescription = "" };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "ShortDescription");
    }

    #endregion

    #region TC06: LongDescription Empty - Abnormal

    [Fact]
    public void Validate_TC06_LongDescriptionEmpty_ShouldFail()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { LongDescription = "" };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "LongDescription");
    }

    #endregion

    #region TC07: LongDescription Max 5000 - Boundary

    [Fact]
    public void Validate_TC07_LongDescriptionMaxChars_ShouldPass()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { LongDescription = CreateString(5000) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC08: Invalid Status - Abnormal

    [Fact]
    public void Validate_TC08_InvalidStatus_ShouldFail()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { Status = (TourStatus)999 };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Status");
    }

    #endregion

    #region TC09: SEOTitle Max 70 - Boundary

    [Fact]
    public void Validate_TC09_SEOTitleMax_ShouldPass()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { SEOTitle = CreateString(70) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC10: SEOTitle Exceeds 70 - Abnormal

    [Fact]
    public void Validate_TC10_SEOTitleExceedsMax_ShouldFail()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { SEOTitle = CreateString(71) };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "SEOTitle");
    }

    #endregion

    #region TC11: Thumbnail Invalid URL - Abnormal

    [Fact]
    public void Validate_TC11_ThumbnailInvalidURL_ShouldFail()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with
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

    #region TC12: Images Empty List - Normal (allowed on update)

    [Fact]
    public void Validate_TC12_ImagesEmpty_ShouldPass()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { Images = [] };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion

    #region TC13: TourName Exceeds 500 - Abnormal

    [Fact]
    public void Validate_TC13_TourNameExceeds500_ShouldFail()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { TourName = CreateString(501) };
        var result = _validator.Validate(command);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "TourName");
    }

    #endregion

    #region TC14: ShortDescription Max 250 - Boundary

    [Fact]
    public void Validate_TC14_ShortDescriptionMax_ShouldPass()
    {
        var command = CreateBaseValidCommand(Guid.NewGuid()) with { ShortDescription = CreateString(250) };
        var result = _validator.Validate(command);
        Assert.True(result.IsValid);
    }

    #endregion
}
