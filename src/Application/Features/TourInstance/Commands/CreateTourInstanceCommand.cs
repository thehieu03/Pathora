using Application.Common;
using Application.Common.Constant;
using Application.Dtos;
using Contracts.Interfaces;
using BuildingBlocks.CORS;
using Domain.Enums;
using ErrorOr;
using FluentValidation;
using Application.Services;

namespace Application.Features.TourInstance.Commands;

public sealed record CreateTourInstanceCommand(
    Guid TourId,
    Guid ClassificationId,
    string Title,
    TourType InstanceType,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    int MinParticipation,
    int MaxParticipation,
    decimal BasePrice,
    decimal SellingPrice,
    decimal OperatingCost,
    string? Location = null,
    DateTimeOffset? ConfirmationDeadline = null,
    List<string>? IncludedServices = null,
    TourInstanceGuideDto? Guide = null,
    List<DynamicPricingDto>? DynamicPricing = null) : ICommand<ErrorOr<Guid>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.TourInstance];
}

public sealed class CreateTourInstanceCommandValidator : AbstractValidator<CreateTourInstanceCommand>
{
    public CreateTourInstanceCommandValidator()
    {
        RuleFor(x => x.TourId)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceTourIdRequired);

        RuleFor(x => x.ClassificationId)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceClassificationIdRequired);

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Tiêu đề là bắt buộc.");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceStartDateRequired);

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceEndDateRequired)
            .GreaterThan(x => x.StartDate).WithMessage(ValidationMessages.TourInstanceEndDateAfterStart);

        RuleFor(x => x.MaxParticipation)
            .GreaterThan(0).WithMessage(ValidationMessages.TourInstanceMaxParticipantsGreaterThanZero);

        RuleFor(x => x.MinParticipation)
            .GreaterThanOrEqualTo(0).WithMessage(ValidationMessages.TourInstanceMinParticipantsNonNegative);

        RuleFor(x => x.BasePrice)
            .GreaterThanOrEqualTo(0).WithMessage("Giá cơ bản không được âm.");

        RuleFor(x => x.SellingPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Giá bán không được âm.");

        RuleFor(x => x.OperatingCost)
            .GreaterThanOrEqualTo(0).WithMessage("Chi phí vận hành không được âm.");
    }
}

public sealed class CreateTourInstanceCommandHandler(ITourInstanceService tourInstanceService)
    : ICommandHandler<CreateTourInstanceCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateTourInstanceCommand request, CancellationToken cancellationToken)
    {
        return await tourInstanceService.Create(request);
    }
}
