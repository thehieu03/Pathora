using Application.Common;
using Application.Common.Constant;
using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using Contracts.Interfaces;
using ErrorOr;
using FluentValidation;

namespace Application.Features.TourInstance.Commands;

public sealed record UpsertTourInstancePricingTiersCommand(
    Guid TourInstanceId,
    List<DynamicPricingDto> Tiers) : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.TourInstance];
}

public sealed class UpsertTourInstancePricingTiersCommandValidator : AbstractValidator<UpsertTourInstancePricingTiersCommand>
{
    public UpsertTourInstancePricingTiersCommandValidator()
    {
        RuleFor(x => x.TourInstanceId)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceIdRequired);

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

public sealed class UpsertTourInstancePricingTiersCommandHandler(IDynamicPricingService dynamicPricingService)
    : ICommandHandler<UpsertTourInstancePricingTiersCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpsertTourInstancePricingTiersCommand request, CancellationToken cancellationToken)
    {
        return await dynamicPricingService.UpsertTourInstanceTiers(request.TourInstanceId, request.Tiers);
    }
}
