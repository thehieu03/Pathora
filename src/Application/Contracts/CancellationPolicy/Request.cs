using Domain.Enums;

namespace Application.Contracts.CancellationPolicy;

public sealed record CreateCancellationPolicyRequest(
    TourScope TourScope,
    int MinDaysBeforeDeparture,
    int MaxDaysBeforeDeparture,
    decimal PenaltyPercentage,
    string ApplyOn = "FullAmount"
);

public sealed record UpdateCancellationPolicyRequest(
    Guid Id,
    TourScope TourScope,
    int MinDaysBeforeDeparture,
    int MaxDaysBeforeDeparture,
    decimal PenaltyPercentage,
    string ApplyOn = "FullAmount",
    CancellationPolicyStatus Status = CancellationPolicyStatus.Active
);

public sealed record CancellationPolicyResponse(
    Guid Id,
    string PolicyCode,
    TourScope TourScope,
    string TourScopeName,
    int MinDaysBeforeDeparture,
    int MaxDaysBeforeDeparture,
    decimal PenaltyPercentage,
    string ApplyOn,
    CancellationPolicyStatus Status,
    string StatusName,
    DateTimeOffset CreatedOnUtc,
    DateTimeOffset? LastModifiedOnUtc
);

public sealed record CalculateRefundRequest(
    Guid TourId,
    DateTimeOffset CancellationDate,
    decimal PaidAmount
);

public sealed record CalculateRefundResponse(
    decimal PaidAmount,
    decimal PenaltyPercentage,
    decimal PenaltyAmount,
    decimal RefundAmount,
    string PolicyCode
);
