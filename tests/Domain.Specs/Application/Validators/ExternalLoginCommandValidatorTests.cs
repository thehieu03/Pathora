using Application.Features.Identity.Commands;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class ExternalLoginCommandValidatorTests
{
    private readonly ExternalLoginCommandValidator _validator = new();

    [Fact]
    public void Validate_WhenValid_ShouldHaveNoErrors()
    {
        var command = new ExternalLoginCommand("google-id-123", "user@gmail.com", "Test User");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenProviderKeyEmpty_ShouldHaveError(string? providerKey)
    {
        var command = new ExternalLoginCommand(providerKey!, "user@gmail.com", "Test User");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ProviderKey);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WhenEmailEmpty_ShouldHaveError(string? email)
    {
        var command = new ExternalLoginCommand("google-id-123", email!, "Test User");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ProviderEmail);
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("missing@")]
    [InlineData("@missing.com")]
    public void Validate_WhenEmailInvalid_ShouldHaveError(string email)
    {
        var command = new ExternalLoginCommand("google-id-123", email, "Test User");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ProviderEmail);
    }
}
