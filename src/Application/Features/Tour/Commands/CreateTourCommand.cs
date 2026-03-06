using Application.Common;
using Application.Common.Constant;
using Contracts.Interfaces;
using Application.Dtos;
using BuildingBlocks.CORS;
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
    Dictionary<string, TourTranslationData>? Translations = null) : ICommand<ErrorOr<Guid>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Tour];
}

public sealed class CreateTourCommandValidator : AbstractValidator<CreateTourCommand>
{
    public CreateTourCommandValidator()
    {
        RuleFor(x => x.TourName)
            .NotEmpty().WithMessage(ValidationMessages.TourNameRequired)
            .MaximumLength(500).WithMessage(ValidationMessages.TourNameMaxLength500);
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



