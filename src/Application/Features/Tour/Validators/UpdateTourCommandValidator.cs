using Application.Common.Constant;
using Application.Features.Tour.Commands;
using FluentValidation;

namespace Application.Features.Tour.Validators;

public sealed class UpdateTourCommandValidator : AbstractValidator<UpdateTourCommand>
{
    public UpdateTourCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Tour ID is required");

        RuleFor(x => x.TourName)
            .NotEmpty().WithMessage(ValidationMessages.TourNameRequired)
            .MaximumLength(500).WithMessage(ValidationMessages.TourNameMaxLength500);

        RuleFor(x => x.ShortDescription)
            .NotEmpty().WithMessage(ValidationMessages.ShortDescriptionRequired)
            .MaximumLength(250).WithMessage(ValidationMessages.ShortDescriptionMaxLength250);

        RuleFor(x => x.LongDescription)
            .NotEmpty().WithMessage(ValidationMessages.LongDescriptionRequired)
            .MaximumLength(5000).WithMessage(ValidationMessages.LongDescriptionMaxLength5000);

        RuleFor(x => x.PricingPolicyId)
            .NotNull().WithMessage("PricingPolicy is required")
            .Must(id => id.HasValue && id.Value != Guid.Empty)
            .WithMessage("PricingPolicy is required");
    }
}
