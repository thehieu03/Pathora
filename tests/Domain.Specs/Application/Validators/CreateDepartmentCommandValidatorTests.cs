using Application.Features.Department.Commands;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class CreateDepartmentCommandValidatorTests
{
    private readonly CreateDepartmentCommandValidator _validator = new();

    [Fact]
    public void Validate_WhenValid_ShouldHaveNoErrors()
    {
        var command = new CreateDepartmentCommand(null, "IT Department");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenNameEmpty_ShouldHaveError(string? name)
    {
        var command = new CreateDepartmentCommand(null, name!);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.DepartmentName);
    }

    [Fact]
    public void Validate_WhenNameExceeds100Chars_ShouldHaveError()
    {
        var longName = new string('A', 101);
        var command = new CreateDepartmentCommand(null, longName);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.DepartmentName);
    }

    [Fact]
    public void Validate_WhenNameExactly100Chars_ShouldPass()
    {
        var name = new string('A', 100);
        var command = new CreateDepartmentCommand(null, name);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveValidationErrorFor(x => x.DepartmentName);
    }
}
