using Application.Services;
using BuildingBlocks.CORS;
using Contracts;
using ErrorOr;

namespace Application.Features.PricingPolicy.Commands;

public sealed record DeletePricingPolicyCommand(Guid Id) : ICommand<ErrorOr<Success>>;

public sealed class DeletePricingPolicyCommandHandler(IPricingPolicyService pricingPolicyService)
    : ICommandHandler<DeletePricingPolicyCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeletePricingPolicyCommand request, CancellationToken cancellationToken)
    {
        return await pricingPolicyService.Delete(request.Id);
    }
}
