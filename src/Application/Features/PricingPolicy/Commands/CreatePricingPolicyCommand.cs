using Application.Contracts.PricingPolicy;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.PricingPolicy.Commands;

public sealed record CreatePricingPolicyCommand(
    string Name,
    Domain.Enums.TourType TourType,
    List<Domain.ValueObjects.PricingPolicyTier> Tiers,
    bool IsDefault = false) : ICommand<ErrorOr<Guid>>;

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
