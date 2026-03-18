namespace Domain.Entities;

using Domain.Enums;

public class CancellationPolicyEntity : Aggregate<Guid>
{
    private static int _policyCodeSequence = Random.Shared.Next(0, 1000);

    public string PolicyCode { get; set; } = null!;
    public TourScope TourScope { get; set; }
    public int MinDaysBeforeDeparture { get; set; }
    public int MaxDaysBeforeDeparture { get; set; }
    public decimal PenaltyPercentage { get; set; }
    public string ApplyOn { get; set; } = "FullAmount";
    public CancellationPolicyStatus Status { get; set; } = CancellationPolicyStatus.Active;
    public bool IsDeleted { get; set; }

    public static string GeneratePolicyCode()
    {
        var datePart = DateTimeOffset.UtcNow.ToString("yyyyMMdd");
        var sequence = Interlocked.Increment(ref _policyCodeSequence) % 1000;
        return $"CP-{datePart}-{sequence:000}";
    }

    public static CancellationPolicyEntity Create(
        TourScope tourScope,
        int minDaysBeforeDeparture,
        int maxDaysBeforeDeparture,
        decimal penaltyPercentage,
        string applyOn = "FullAmount",
        CancellationPolicyStatus status = CancellationPolicyStatus.Active,
        string performedBy = "system")
    {
        return new CancellationPolicyEntity
        {
            Id = Guid.CreateVersion7(),
            PolicyCode = GeneratePolicyCode(),
            TourScope = tourScope,
            MinDaysBeforeDeparture = minDaysBeforeDeparture,
            MaxDaysBeforeDeparture = maxDaysBeforeDeparture,
            PenaltyPercentage = penaltyPercentage,
            ApplyOn = applyOn,
            Status = status,
            IsDeleted = false,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(
        TourScope tourScope,
        int minDaysBeforeDeparture,
        int maxDaysBeforeDeparture,
        decimal penaltyPercentage,
        string applyOn,
        CancellationPolicyStatus status,
        string performedBy)
    {
        TourScope = tourScope;
        MinDaysBeforeDeparture = minDaysBeforeDeparture;
        MaxDaysBeforeDeparture = maxDaysBeforeDeparture;
        PenaltyPercentage = penaltyPercentage;
        ApplyOn = applyOn;
        Status = status;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void Activate(string performedBy)
    {
        Status = CancellationPolicyStatus.Active;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void Deactivate(string performedBy)
    {
        Status = CancellationPolicyStatus.Inactive;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void SoftDelete(string performedBy)
    {
        IsDeleted = true;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public decimal CalculateRefund(decimal paidAmount)
    {
        var penaltyAmount = paidAmount * PenaltyPercentage / 100;
        return paidAmount - penaltyAmount;
    }
}
