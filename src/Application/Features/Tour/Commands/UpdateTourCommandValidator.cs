using Application.Common.Constant;
using Application.Dtos;
using Application.Features.Tour.Validators;
using FluentValidation;

namespace Application.Features.Tour.Commands;

public sealed class UpdateTourCommandValidator : AbstractValidator<UpdateTourCommand>
{
    public UpdateTourCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Tour ID is required.");

        RuleFor(x => x.TourName)
            .NotEmpty().WithMessage(ValidationMessages.TourNameRequired)
            .MaximumLength(500).WithMessage(ValidationMessages.TourNameMaxLength500);

        RuleFor(x => x.ShortDescription)
            .NotEmpty().WithMessage(ValidationMessages.ShortDescriptionRequired)
            .MaximumLength(250).WithMessage(ValidationMessages.ShortDescriptionMaxLength250);

        RuleFor(x => x.LongDescription)
            .NotEmpty().WithMessage(ValidationMessages.LongDescriptionRequired)
            .MaximumLength(5000).WithMessage(ValidationMessages.LongDescriptionMaxLength5000);

        RuleFor(x => x.SEOTitle)
            .MaximumLength(70).WithMessage(ValidationMessages.SEOTitleMaxLength70)
            .When(x => x.SEOTitle != null);

        RuleFor(x => x.SEODescription)
            .MaximumLength(320).WithMessage(ValidationMessages.SEODescriptionMaxLength320)
            .When(x => x.SEODescription != null);

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage(ValidationMessages.TourStatusInvalid);

        RuleFor(x => x.Thumbnail)
            .NotNull().WithMessage(ValidationMessages.ThumbnailRequired)
            .SetValidator(new ImageInputDtoValidator()!)
            .When(x => x.Thumbnail != null);

        RuleForEach(x => x.Images)
            .SetValidator(new ImageInputDtoValidator()!)
            .When(x => x.Images != null && x.Images.Count > 0);
    }
}
