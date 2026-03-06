using Application.Features.User.Commands;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class CreateUserCommandValidatorTests
{
    private readonly CreateUserCommandValidator _validator = new();

    [Fact]
    public void Validate_WhenValid_ShouldHaveNoErrors()
    {
        var command = new CreateUserCommand([], [], "user@example.com", "John Doe", "avatar.jpg");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenEmailEmpty_ShouldHaveError(string? email)
    {
        var command = new CreateUserCommand([], [], email!, "John Doe", "avatar.jpg");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("missing@")]
    public void Validate_WhenEmailInvalid_ShouldHaveError(string email)
    {
        var command = new CreateUserCommand([], [], email, "John Doe", "avatar.jpg");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenFullNameEmpty_ShouldHaveError(string? fullName)
    {
        var command = new CreateUserCommand([], [], "user@example.com", fullName!, "avatar.jpg");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.FullName);
    }
}
