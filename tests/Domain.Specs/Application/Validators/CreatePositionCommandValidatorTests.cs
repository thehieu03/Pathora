using Application.Features.Position.Commands;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class CreatePositionCommandValidatorTests
{
    private readonly CreatePositionCommandValidator _validator = new();

    [Fact]
    public void Validate_WhenValid_ShouldHaveNoErrors()
    {
        var command = new CreatePositionCommand("Manager", 1, null, null);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenNameEmpty_ShouldHaveError(string? name)
    {
        var command = new CreatePositionCommand(name!, 1, null, null);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WhenNameExceeds255Chars_ShouldHaveError()
    {
        var longName = new string('A', 256);
        var command = new CreatePositionCommand(longName, 1, null, null);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WhenNameExactly255Chars_ShouldPass()
    {
        var name = new string('A', 255);
        var command = new CreatePositionCommand(name, 1, null, null);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveValidationErrorFor(x => x.Name);
    }
}
