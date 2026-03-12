using Application.Common;
using Application.Common.Constant;
using Application.Services;
using BuildingBlocks.CORS;
using Contracts.Interfaces;
using ErrorOr;
using FluentValidation;

namespace Application.Features.TourInstance.Commands;

public sealed record ClearTourInstancePricingTiersCommand(Guid TourInstanceId)
    : ICommand<ErrorOr<Success>>, ICacheInvalidator
{
    public IReadOnlyList<string> CacheKeysToInvalidate => [CacheKey.TourInstance];
}

public sealed class ClearTourInstancePricingTiersCommandValidator : AbstractValidator<ClearTourInstancePricingTiersCommand>
{
    public ClearTourInstancePricingTiersCommandValidator()
    {
        RuleFor(x => x.TourInstanceId)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceIdRequired);
    }
}

public sealed class ClearTourInstancePricingTiersCommandHandler(IDynamicPricingService dynamicPricingService)
    : ICommandHandler<ClearTourInstancePricingTiersCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(ClearTourInstancePricingTiersCommand request, CancellationToken cancellationToken)
    {
        return await dynamicPricingService.ClearTourInstanceTiers(request.TourInstanceId);
    }
}
