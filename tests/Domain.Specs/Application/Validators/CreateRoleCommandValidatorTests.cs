using Application.Features.Role.Commands;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class CreateRoleCommandValidatorTests
{
    private readonly CreateRoleCommandValidator _validator = new();

    [Fact]
    public void Validate_WhenValid_ShouldHaveNoErrors()
    {
        var command = new CreateRoleCommand("Admin", "System admin role", 1, []);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenNameEmpty_ShouldHaveError(string? name)
    {
        var command = new CreateRoleCommand(name!, "desc", 1, []);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WhenNameExceeds100Chars_ShouldHaveError()
    {
        var longName = new string('A', 101);
        var command = new CreateRoleCommand(longName, "desc", 1, []);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_WhenDescriptionExceeds250Chars_ShouldHaveError()
    {
        var longDesc = new string('A', 251);
        var command = new CreateRoleCommand("Admin", longDesc, 1, []);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validate_WhenDescriptionExactly250Chars_ShouldPass()
    {
        var desc = new string('A', 250);
        var command = new CreateRoleCommand("Admin", desc, 1, []);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveValidationErrorFor(x => x.Description);
    }
}
