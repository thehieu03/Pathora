using Application.Common;
using Application.Common.Constant;
using Application.Dtos;
using Application.Features.Tour.Validators;
using BuildingBlocks.CORS;
using Contracts.Interfaces;
using Domain.Entities.Translations;
using Domain.Enums;
using ErrorOr;
using FluentValidation;
using Application.Services;

namespace Application.Features.Tour.Commands;

public sealed record CreateTourCommand(
    string TourName,
    string ShortDescription,
    string LongDescription,
    string? SEOTitle,
    string? SEODescription,
    TourStatus Status,
    ImageInputDto? Thumbnail = null,
    List<ImageInputDto>? Images = null,
    Dictionary<string, TourTranslationData>? Translations = null,
    List<ClassificationDto>? Classifications = null,
    Guid? VisaPolicyId = null,
    Guid? DepositPolicyId = null,
    Guid? PricingPolicyId = null,
    Guid? CancellationPolicyId = null) : ICommand<ErrorOr<Guid>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Tour];
}

public sealed class CreateTourCommandValidator : AbstractValidator<CreateTourCommand>
{
    public CreateTourCommandValidator()
    {
        // TourName - Required, Max 500 chars
        RuleFor(x => x.TourName)
            .NotEmpty().WithMessage(ValidationMessages.TourNameRequired)
            .MaximumLength(500).WithMessage(ValidationMessages.TourNameMaxLength500);

        // ShortDescription - Required, Max 250 chars
        RuleFor(x => x.ShortDescription)
            .NotEmpty().WithMessage(ValidationMessages.ShortDescriptionRequired)
            .MaximumLength(250).WithMessage(ValidationMessages.ShortDescriptionMaxLength250);

        // LongDescription - Required, Max 5000 chars
        RuleFor(x => x.LongDescription)
            .NotEmpty().WithMessage(ValidationMessages.LongDescriptionRequired)
            .MaximumLength(5000).WithMessage(ValidationMessages.LongDescriptionMaxLength5000);

        // SEOTitle - Optional, Max 70 chars
        RuleFor(x => x.SEOTitle)
            .MaximumLength(70).WithMessage(ValidationMessages.SEOTitleMaxLength70)
            .When(x => x.SEOTitle != null);

        // SEODescription - Optional, Max 320 chars
        RuleFor(x => x.SEODescription)
            .MaximumLength(320).WithMessage(ValidationMessages.SEODescriptionMaxLength320)
            .When(x => x.SEODescription != null);

        // Status - Required
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage(ValidationMessages.TourStatusInvalid);

        // Thumbnail - Required
        RuleFor(x => x.Thumbnail)
            .NotNull().WithMessage(ValidationMessages.ThumbnailRequired)
            .SetValidator(new ImageInputDtoValidator()!);

        // Images - Required, at least 1 image
        RuleFor(x => x.Images)
            .NotNull().WithMessage(ValidationMessages.ImagesRequired)
            .Must(images => images != null && images.Count > 0)
            .WithMessage(ValidationMessages.ImagesAtLeastOne);

        RuleForEach(x => x.Images)
            .SetValidator(new ImageInputDtoValidator()!)
            .When(x => x.Images != null);

        // Classifications - Optional but must be valid
        RuleForEach(x => x.Classifications)
            .SetValidator(new ClassificationDtoValidator())
            .When(x => x.Classifications != null && x.Classifications.Any());
    }
}

public sealed class CreateTourCommandHandler(ITourService tourService)
    : ICommandHandler<CreateTourCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateTourCommand request, CancellationToken cancellationToken)
    {
        return await tourService.Create(request);
    }
}



