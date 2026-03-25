using Application.Contracts.PricingPolicy;
using Application.Services;
using BuildingBlocks.CORS;
using Domain.ValueObjects;
using ErrorOr;
using FluentValidation;

namespace Application.Features.PricingPolicy.Commands;

public sealed record CreatePricingPolicyCommand(
    string Name,
    Domain.Enums.TourType TourType,
    List<Domain.ValueObjects.PricingPolicyTier> Tiers,
    bool IsDefault = false) : ICommand<ErrorOr<Guid>>;

public sealed class CreatePricingPolicyCommandValidator : AbstractValidator<CreatePricingPolicyCommand>
{
    public CreatePricingPolicyCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Policy name is required.");

        RuleFor(x => x.Tiers)
            .NotEmpty().WithMessage("At least one pricing tier is required.")
            .ForEach(tier => tier.SetValidator(new PricingPolicyTierValidator()));
    }
}

public sealed class PricingPolicyTierValidator : AbstractValidator<PricingPolicyTier>
{
    public PricingPolicyTierValidator()
    {
        RuleFor(x => x.Label)
            .NotEmpty().WithMessage("Tier label is required.");

        RuleFor(x => x.AgeFrom)
            .GreaterThanOrEqualTo(0).WithMessage("Age from must be non-negative.");

        RuleFor(x => x.PricePercentage)
            .InclusiveBetween(0, 100).WithMessage("Price percentage must be between 0 and 100.");

        RuleFor(x => x)
            .Must(tier => !tier.AgeTo.HasValue || tier.AgeTo >= tier.AgeFrom)
            .WithMessage("Age to must be greater than or equal to age from.");
    }
}

public sealed class CreatePricingPolicyCommandHandler(IPricingPolicyService pricingPolicyService)
    : ICommandHandler<CreatePricingPolicyCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreatePricingPolicyCommand request, CancellationToken cancellationToken)
    {
        return await pricingPolicyService.Create(new CreatePricingPolicyRequest(
            request.Name,
            request.TourType,
            request.Tiers,
            request.IsDefault));
    }
}
