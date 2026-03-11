using Application.Common;
using Application.Dtos;
using Application.Services;
using BuildingBlocks.CORS;
using Contracts.Interfaces;
using ErrorOr;

namespace Application.Features.Tour.Queries;

public sealed record GetClassificationPricingTiersQuery(Guid ClassificationId)
    : IQuery<ErrorOr<List<DynamicPricingDto>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Tour}:classification-pricing:{ClassificationId}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
}

public sealed class GetClassificationPricingTiersQueryHandler(IDynamicPricingService dynamicPricingService)
    : IQueryHandler<GetClassificationPricingTiersQuery, ErrorOr<List<DynamicPricingDto>>>
{
    public async Task<ErrorOr<List<DynamicPricingDto>>> Handle(GetClassificationPricingTiersQuery request, CancellationToken cancellationToken)
    {
        return await dynamicPricingService.GetClassificationTiers(request.ClassificationId);
    }
}
