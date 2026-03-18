using Domain.Enums;
using Domain.ValueObjects;

namespace Application.Contracts.PricingPolicy;

public sealed record CreatePricingPolicyRequest(
    string Name,
    TourType TourType,
    List<PricingPolicyTier> Tiers,
    bool IsDefault = false
);

public sealed record UpdatePricingPolicyRequest(
    Guid Id,
    string Name,
    TourType TourType,
    List<PricingPolicyTier> Tiers
);

public sealed record PricingPolicyResponse(
    Guid Id,
    string PolicyCode,
    string Name,
    TourType TourType,
    string TourTypeName,
    PricingPolicyStatus Status,
    string StatusName,
    bool IsDefault,
    List<PricingPolicyTier> Tiers,
    DateTimeOffset CreatedOnUtc,
    DateTimeOffset? LastModifiedOnUtc
);

public sealed record SetDefaultPricingPolicyRequest(Guid Id);
