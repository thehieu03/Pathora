using Application.Dtos;
using Application.Features.Tour.Commands;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class UpsertClassificationPricingTiersCommandValidatorTests
{
    private readonly UpsertClassificationPricingTiersCommandValidator _validator = new();

    [Fact]
    public void Validate_WhenRangesOverlap_ShouldHaveError()
    {
        var command = new UpsertClassificationPricingTiersCommand(
            Guid.CreateVersion7(),
            [
                new DynamicPricingDto(4, 6, 2500000m),
                new DynamicPricingDto(6, 9, 2300000m)
            ]);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Tiers);
    }

    [Fact]
    public void Validate_WhenRangesDoNotOverlap_ShouldPass()
    {
        var command = new UpsertClassificationPricingTiersCommand(
            Guid.CreateVersion7(),
            [
                new DynamicPricingDto(4, 6, 2500000m),
                new DynamicPricingDto(7, 9, 2300000m)
            ]);

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveValidationErrorFor(x => x.Tiers);
    }
}
