namespace Application.Contracts.VisaPolicy;

public sealed record CreateVisaPolicyRequest(
    string Region,
    int ProcessingDays,
    int BufferDays,
    bool FullPaymentRequired
);

public sealed record UpdateVisaPolicyRequest(
    Guid Id,
    string Region,
    int ProcessingDays,
    int BufferDays,
    bool FullPaymentRequired,
    bool IsActive
);

public sealed record VisaPolicyResponse(
    Guid Id,
    string Region,
    int ProcessingDays,
    int BufferDays,
    bool FullPaymentRequired,
    bool IsActive,
    bool IsDeleted,
    DateTimeOffset CreatedOnUtc,
    DateTimeOffset? LastModifiedOnUtc
);
