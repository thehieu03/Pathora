using Application.Features.TourRequest.Commands;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class CreateTourRequestCommandValidatorTests
{
    private readonly CreateTourRequestCommandValidator _validator = new();

    [Fact]
    public void Validate_WhenValid_ShouldHaveNoErrors()
    {
        var command = new CreateTourRequestCommand(
            Destination: "Da Nang",
            StartDate: new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero),
            EndDate: new DateTimeOffset(2026, 5, 5, 0, 0, 0, TimeSpan.Zero),
            NumberOfParticipants: 4,
            BudgetPerPersonUsd: 500,
            TravelInterests: ["Adventure", "FoodAndCulinary"],
            PreferredAccommodation: "4-star hotel",
            TransportationPreference: "Flight",
            SpecialRequests: "Need vegetarian options");

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WhenEndDateBeforeStartDate_ShouldHaveError()
    {
        var command = new CreateTourRequestCommand(
            "Da Nang",
            new DateTimeOffset(2026, 5, 5, 0, 0, 0, TimeSpan.Zero),
            new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero),
            2,
            300,
            ["Adventure"]);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.EndDate);
    }

    [Fact]
    public void Validate_WhenParticipantsNotPositive_ShouldHaveError()
    {
        var command = new CreateTourRequestCommand(
            "Da Nang",
            new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero),
            new DateTimeOffset(2026, 5, 5, 0, 0, 0, TimeSpan.Zero),
            0,
            300,
            ["Adventure"]);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.NumberOfParticipants);
    }

    [Fact]
    public void Validate_WhenTravelInterestInvalid_ShouldHaveError()
    {
        var command = new CreateTourRequestCommand(
            "Da Nang",
            new DateTimeOffset(2026, 5, 1, 0, 0, 0, TimeSpan.Zero),
            new DateTimeOffset(2026, 5, 5, 0, 0, 0, TimeSpan.Zero),
            2,
            300,
            ["InvalidInterest"]);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor("TravelInterests[0]");
    }
}
