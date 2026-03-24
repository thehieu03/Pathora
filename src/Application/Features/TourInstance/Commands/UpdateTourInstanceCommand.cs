using Application.Common;
using Application.Common.Constant;
using Application.Dtos;
using Contracts.Interfaces;
using BuildingBlocks.CORS;
using ErrorOr;
using FluentValidation;
using Application.Services;

namespace Application.Features.TourInstance.Commands;

public sealed record UpdateTourInstanceCommand(
    Guid Id,
    string Title,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    int MinParticipation,
    int MaxParticipation,
    decimal BasePrice,
    decimal DepositPerPerson,
    string? Location = null,
    DateTimeOffset? ConfirmationDeadline = null,
    List<string>? IncludedServices = null,
    TourInstanceGuideDto? Guide = null,
    List<DynamicPricingDto>? DynamicPricing = null) : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.TourInstance];
}

public sealed class UpdateTourInstanceCommandValidator : AbstractValidator<UpdateTourInstanceCommand>
{
    public UpdateTourInstanceCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceIdRequired);

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceTitleRequired);

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
            .GreaterThanOrEqualTo(0).WithMessage(ValidationMessages.TourInstanceBasePriceNonNegative);

        RuleFor(x => x.DepositPerPerson)
            .GreaterThanOrEqualTo(0).WithMessage(ValidationMessages.TourInstanceDepositPerPersonNonNegative);

        RuleForEach(x => x.DynamicPricing)
            .ChildRules(tier =>
            {
                tier.RuleFor(x => x.MinParticipants)
                    .GreaterThan(0).WithMessage(ValidationMessages.DynamicPricingMinParticipantsGreaterThanZero);

                tier.RuleFor(x => x.MaxParticipants)
                    .GreaterThanOrEqualTo(x => x.MinParticipants)
                    .WithMessage(ValidationMessages.DynamicPricingMaxParticipantsGreaterThanOrEqualMin);

                tier.RuleFor(x => x.PricePerPerson)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage(ValidationMessages.DynamicPricingPricePerPersonNonNegative);
            });

        RuleFor(x => x.DynamicPricing)
            .Must(HaveNoOverlappingRanges)
            .WithMessage(ValidationMessages.DynamicPricingRangeMustNotOverlap)
            .When(x => x.DynamicPricing is { Count: > 1 });
    }

    private static bool HaveNoOverlappingRanges(List<DynamicPricingDto>? tiers)
    {
        if (tiers is null || tiers.Count <= 1)
        {
            return true;
        }

        var ordered = tiers
            .OrderBy(tier => tier.MinParticipants)
            .ThenBy(tier => tier.MaxParticipants)
            .ToList();

        for (var index = 1; index < ordered.Count; index++)
        {
            if (ordered[index].MinParticipants <= ordered[index - 1].MaxParticipants)
            {
                return false;
            }
        }

        return true;
    }
}

public sealed class UpdateTourInstanceCommandHandler(ITourInstanceService tourInstanceService)
    : ICommandHandler<UpdateTourInstanceCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateTourInstanceCommand request, CancellationToken cancellationToken)
    {
        return await tourInstanceService.Update(request);
    }
}
