using Application.Features.Identity.Commands;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class RegisterCommandValidatorTests
{
    private readonly RegisterCommandValidator _validator = new();

    [Fact]
    public void Validate_WhenValid_ShouldHaveNoErrors()
    {
        var command = new RegisterCommand("johndoe", "John Doe", "john@example.com", "secret123");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenEmailEmpty_ShouldHaveError(string? email)
    {
        var command = new RegisterCommand("johndoe", "John Doe", email!, "secret123");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("missing@")]
    public void Validate_WhenEmailInvalid_ShouldHaveError(string email)
    {
        var command = new RegisterCommand("johndoe", "John Doe", email, "secret123");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenFullNameEmpty_ShouldHaveError(string? fullName)
    {
        var command = new RegisterCommand("johndoe", fullName!, "john@example.com", "secret123");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.FullName);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenUsernameEmpty_ShouldHaveError(string? username)
    {
        var command = new RegisterCommand(username!, "John Doe", "john@example.com", "secret123");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Username);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenPasswordEmpty_ShouldHaveError(string? password)
    {
        var command = new RegisterCommand("johndoe", "John Doe", "john@example.com", password!);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Validate_WhenPasswordTooShort_ShouldHaveError()
    {
        var command = new RegisterCommand("johndoe", "John Doe", "john@example.com", "12345");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Validate_WhenPasswordExactly6Chars_ShouldPass()
    {
        var command = new RegisterCommand("johndoe", "John Doe", "john@example.com", "123456");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveValidationErrorFor(x => x.Password);
    }
}
