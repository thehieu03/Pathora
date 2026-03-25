using Application.Contracts.PricingPolicy;
using Application.Services;
using BuildingBlocks.CORS;
using Domain.Entities.Translations;
using Domain.ValueObjects;
using Contracts;
using ErrorOr;
using FluentValidation;

namespace Application.Features.PricingPolicy.Commands;

public sealed record UpdatePricingPolicyCommand(
    Guid Id,
    string Name,
    Domain.Enums.TourType TourType,
    List<Domain.ValueObjects.PricingPolicyTier> Tiers,
    Domain.Enums.PricingPolicyStatus? Status = null,
    Dictionary<string, PricingPolicyTranslationData>? Translations = null) : ICommand<ErrorOr<Success>>;

public sealed class UpdatePricingPolicyCommandValidator : AbstractValidator<UpdatePricingPolicyCommand>
{
    public UpdatePricingPolicyCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Policy ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Policy name is required.");

        RuleFor(x => x.Tiers)
            .NotEmpty().WithMessage("At least one pricing tier is required.")
            .ForEach(tier => tier.SetValidator(new PricingPolicyTierValidator()));
    }
}

public sealed class UpdatePricingPolicyCommandHandler(IPricingPolicyService pricingPolicyService)
    : ICommandHandler<UpdatePricingPolicyCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdatePricingPolicyCommand request, CancellationToken cancellationToken)
    {
        return await pricingPolicyService.Update(new UpdatePricingPolicyRequest(
            request.Id,
            request.Name,
            request.TourType,
            request.Tiers,
            request.Status,
            request.Translations));
    }
}
