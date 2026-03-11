using Application.Common;
using Application.Common.Constant;
using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using Contracts.Interfaces;
using ErrorOr;
using FluentValidation;

namespace Application.Features.TourInstance.Queries;

public sealed record ResolveTourInstancePricingQuery(Guid TourInstanceId, int Participants)
    : IQuery<ErrorOr<DynamicPricingResolutionDto>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.TourInstance}:pricing-resolution:{TourInstanceId}:{Participants}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}

public sealed class ResolveTourInstancePricingQueryValidator : AbstractValidator<ResolveTourInstancePricingQuery>
{
    public ResolveTourInstancePricingQueryValidator()
    {
        RuleFor(x => x.TourInstanceId)
            .NotEmpty().WithMessage(ValidationMessages.TourInstanceIdRequired);

        RuleFor(x => x.Participants)
            .GreaterThan(0).WithMessage(ValidationMessages.DynamicPricingMinParticipantsGreaterThanZero);
    }
}

public sealed class ResolveTourInstancePricingQueryHandler(IDynamicPricingService dynamicPricingService)
    : IQueryHandler<ResolveTourInstancePricingQuery, ErrorOr<DynamicPricingResolutionDto>>
{
    public async Task<ErrorOr<DynamicPricingResolutionDto>> Handle(ResolveTourInstancePricingQuery request, CancellationToken cancellationToken)
    {
        return await dynamicPricingService.ResolveForTourInstance(request.TourInstanceId, request.Participants);
    }
}
