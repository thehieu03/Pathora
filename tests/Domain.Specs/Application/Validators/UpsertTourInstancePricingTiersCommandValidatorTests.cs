using Application.Dtos;
using Application.Features.TourInstance.Commands;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class UpsertTourInstancePricingTiersCommandValidatorTests
{
    private readonly UpsertTourInstancePricingTiersCommandValidator _validator = new();

    [Fact]
    public void Validate_WhenRangeBoundsInvalid_ShouldHaveChildErrors()
    {
        var command = new UpsertTourInstancePricingTiersCommand(
            Guid.CreateVersion7(),
            [new DynamicPricingDto(5, 4, -1m)]);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor("Tiers[0].MaxParticipants");
        result.ShouldHaveValidationErrorFor("Tiers[0].PricePerPerson");
    }

    [Fact]
    public void Validate_WhenRangesOverlap_ShouldHaveError()
    {
        var command = new UpsertTourInstancePricingTiersCommand(
            Guid.CreateVersion7(),
            [
                new DynamicPricingDto(4, 6, 2200000m),
                new DynamicPricingDto(6, 8, 2000000m)
            ]);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Tiers);
    }
}
