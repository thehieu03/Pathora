using Application.Contracts.PricingPolicy;
using Application.Services;
using BuildingBlocks.CORS;
using Contracts;
using ErrorOr;

namespace Application.Features.PricingPolicy.Commands;

public sealed record UpdatePricingPolicyCommand(
    Guid Id,
    string Name,
    Domain.Enums.TourType TourType,
    List<Domain.ValueObjects.PricingPolicyTier> Tiers) : ICommand<ErrorOr<Success>>;

public sealed class UpdatePricingPolicyCommandHandler(IPricingPolicyService pricingPolicyService)
    : ICommandHandler<UpdatePricingPolicyCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdatePricingPolicyCommand request, CancellationToken cancellationToken)
    {
        return await pricingPolicyService.Update(new UpdatePricingPolicyRequest(
            request.Id,
            request.Name,
            request.TourType,
            request.Tiers));
    }
}
