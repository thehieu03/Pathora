using Application.Common;
using Application.Common.Constant;
using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using Contracts.Interfaces;
using ErrorOr;
using FluentValidation;

namespace Application.Features.Tour.Commands;

public sealed record UpsertClassificationPricingTiersCommand(
    Guid ClassificationId,
    List<DynamicPricingDto> Tiers) : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.Tour, CacheKey.TourInstance];
}

public sealed class UpsertClassificationPricingTiersCommandValidator : AbstractValidator<UpsertClassificationPricingTiersCommand>
{
    public UpsertClassificationPricingTiersCommandValidator()
    {
        RuleFor(x => x.ClassificationId)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceClassificationIdRequired);

        RuleForEach(x => x.Tiers)
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

        RuleFor(x => x.Tiers)
            .Must(HaveNoOverlappingRanges)
            .WithMessage(ValidationMessages.DynamicPricingRangeMustNotOverlap)
            .When(x => x.Tiers.Count > 1);
    }

    private static bool HaveNoOverlappingRanges(List<DynamicPricingDto> tiers)
    {
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

public sealed class UpsertClassificationPricingTiersCommandHandler(IDynamicPricingService dynamicPricingService)
    : ICommandHandler<UpsertClassificationPricingTiersCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpsertClassificationPricingTiersCommand request, CancellationToken cancellationToken)
    {
        return await dynamicPricingService.UpsertClassificationTiers(request.ClassificationId, request.Tiers);
    }
}
