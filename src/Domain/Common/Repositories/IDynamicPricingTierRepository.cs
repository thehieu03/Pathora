using Domain.Entities;

namespace Domain.Common.Repositories;

public interface IDynamicPricingTierRepository
{
    Task<bool> ClassificationExists(Guid classificationId);
    Task<bool> TourInstanceExists(Guid tourInstanceId);

    Task<List<DynamicPricingTierEntity>> GetByClassificationId(Guid classificationId, bool asNoTracking = false);
    Task<List<DynamicPricingTierEntity>> GetByTourInstanceId(Guid tourInstanceId, bool asNoTracking = false);

    Task ReplaceForClassification(Guid classificationId, IReadOnlyCollection<DynamicPricingTierEntity> tiers);
    Task ReplaceForTourInstance(Guid tourInstanceId, IReadOnlyCollection<DynamicPricingTierEntity> tiers);
    Task ClearForTourInstance(Guid tourInstanceId);

    Task<TourInstanceEntity?> FindTourInstanceWithPricing(Guid tourInstanceId, bool asNoTracking = false);
}
