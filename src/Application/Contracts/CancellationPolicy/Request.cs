using System.Text.Json.Serialization;
using Domain.Entities.Translations;
using Domain.Enums;

namespace Application.Contracts.CancellationPolicy;

public sealed record CreateCancellationPolicyRequest(
    TourScope TourScope,
    int MinDaysBeforeDeparture,
    int MaxDaysBeforeDeparture,
    decimal PenaltyPercentage,
    string ApplyOn = "FullAmount",
    [property: JsonPropertyName("translations")]
    Dictionary<string, CancellationPolicyTranslationData>? Translations = null
);

public sealed record UpdateCancellationPolicyRequest(
    Guid Id,
    TourScope TourScope,
    int MinDaysBeforeDeparture,
    int MaxDaysBeforeDeparture,
    decimal PenaltyPercentage,
    string ApplyOn = "FullAmount",
    CancellationPolicyStatus Status = CancellationPolicyStatus.Active,
    Dictionary<string, CancellationPolicyTranslationData>? Translations = null
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
    Dictionary<string, CancellationPolicyTranslationData> Translations,
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
