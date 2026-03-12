using Application.Common;
using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using Contracts.Interfaces;
using ErrorOr;

namespace Application.Features.TourInstance.Queries;

public sealed record GetTourInstancePricingTiersQuery(Guid TourInstanceId)
    : IQuery<ErrorOr<List<DynamicPricingDto>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.TourInstance}:pricing-tiers:{TourInstanceId}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
}

public sealed class GetTourInstancePricingTiersQueryHandler(IDynamicPricingService dynamicPricingService)
    : IQueryHandler<GetTourInstancePricingTiersQuery, ErrorOr<List<DynamicPricingDto>>>
{
    public async Task<ErrorOr<List<DynamicPricingDto>>> Handle(GetTourInstancePricingTiersQuery request, CancellationToken cancellationToken)
    {
        return await dynamicPricingService.GetTourInstanceTiers(request.TourInstanceId);
    }
}
