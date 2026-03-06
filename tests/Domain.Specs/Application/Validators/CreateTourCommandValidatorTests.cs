using Application.Features.Tour.Commands;
using Domain.Enums;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class CreateTourCommandValidatorTests
{
    private readonly CreateTourCommandValidator _validator = new();

    [Fact]
    public void Validate_WhenValid_ShouldHaveNoErrors()
    {
        var command = new CreateTourCommand("Tour Đà Nẵng", "Short", "Long", null, null, TourStatus.Active);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenTourNameEmpty_ShouldHaveError(string? name)
    {
        var command = new CreateTourCommand(name!, "Short", "Long", null, null, TourStatus.Active);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.TourName);
    }

    [Fact]
    public void Validate_WhenTourNameExceeds500Chars_ShouldHaveError()
    {
        var longName = new string('A', 501);
        var command = new CreateTourCommand(longName, "Short", "Long", null, null, TourStatus.Active);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.TourName);
    }

    [Fact]
    public void Validate_WhenTourNameExactly500Chars_ShouldPass()
    {
        var name = new string('A', 500);
        var command = new CreateTourCommand(name, "Short", "Long", null, null, TourStatus.Active);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveValidationErrorFor(x => x.TourName);
    }
}
