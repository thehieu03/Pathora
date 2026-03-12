using Application.Features.TourRequest.Commands;
using Domain.Enums;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class ReviewTourRequestCommandValidatorTests
{
    private readonly ReviewTourRequestCommandValidator _validator = new();

    [Theory]
    [InlineData(TourRequestStatus.Approved)]
    [InlineData(TourRequestStatus.Rejected)]
    public void Validate_WhenStatusIsApprovedOrRejected_ShouldPass(TourRequestStatus status)
    {
        var command = new ReviewTourRequestCommand(Guid.CreateVersion7(), status, "Reviewed");

        var result = _validator.TestValidate(command);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(TourRequestStatus.Pending)]
    [InlineData(TourRequestStatus.Cancelled)]
    public void Validate_WhenStatusInvalidForReview_ShouldHaveError(TourRequestStatus status)
    {
        var command = new ReviewTourRequestCommand(Guid.CreateVersion7(), status, "Reviewed");

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Status);
    }

    [Fact]
    public void Validate_WhenIdEmpty_ShouldHaveError()
    {
        var command = new ReviewTourRequestCommand(Guid.Empty, TourRequestStatus.Approved, null);

        var result = _validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.Id);
    }
}
