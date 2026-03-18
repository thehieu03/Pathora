using BuildingBlocks.CORS;

namespace Application.Contracts.DepositPolicy;

public sealed record DepositPolicyResponse(
    Guid Id,
    int TourScope,
    string TourScopeName,
    int DepositType,
    string DepositTypeName,
    decimal DepositValue,
    int MinDaysBeforeDeparture,
    bool IsActive,
    DateTimeOffset CreatedOnUtc,
    DateTimeOffset? LastModifiedOnUtc
);

public sealed record CreateDepositPolicyRequest(
    int TourScope,
    int DepositType,
    decimal DepositValue,
    int MinDaysBeforeDeparture
);

public sealed record UpdateDepositPolicyRequest(
    Guid Id,
    int TourScope,
    int DepositType,
    decimal DepositValue,
    int MinDaysBeforeDeparture,
    bool IsActive
);
