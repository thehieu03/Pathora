namespace Domain.Entities;

using Domain.Entities.Translations;

// nó liên quan đến thoiwf gian xử lý
public class VisaPolicyEntity : Aggregate<Guid>
{
    public string Region { get; set; } = null!;
    public int ProcessingDays { get; set; }
    public int BufferDays { get; set; }
    public bool FullPaymentRequired { get; set; }
    public bool IsDeleted { get; set; }
    public bool IsActive { get; set; } = true;

    // Translations (en, vi)
    public Dictionary<string, VisaPolicyTranslationData> Translations { get; set; } = [];

    public static VisaPolicyEntity Create(
        string region,
        int processingDays,
        int bufferDays,
        bool fullPaymentRequired,
        string performedBy,
        Dictionary<string, VisaPolicyTranslationData>? translations = null)
    {
        if (string.IsNullOrWhiteSpace(region))
            throw new ArgumentException("Region is required.", nameof(region));
        if (processingDays <= 0)
            throw new ArgumentOutOfRangeException(nameof(processingDays), "Processing days must be greater than 0.");
        if (bufferDays < 0)
            throw new ArgumentOutOfRangeException(nameof(bufferDays), "Buffer days cannot be negative.");

        return new VisaPolicyEntity
        {
            Id = Guid.CreateVersion7(),
            Region = region,
            ProcessingDays = processingDays,
            BufferDays = bufferDays,
            FullPaymentRequired = fullPaymentRequired,
            IsDeleted = false,
            IsActive = true,
            Translations = translations ?? [],
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(
        string region,
        int processingDays,
        int bufferDays,
        bool fullPaymentRequired,
        string performedBy)
    {
        if (string.IsNullOrWhiteSpace(region))
            throw new ArgumentException("Region is required.", nameof(region));
        if (processingDays <= 0)
            throw new ArgumentOutOfRangeException(nameof(processingDays), "Processing days must be greater than 0.");
        if (bufferDays < 0)
            throw new ArgumentOutOfRangeException(nameof(bufferDays), "Buffer days cannot be negative.");

        Region = region;
        ProcessingDays = processingDays;
        BufferDays = bufferDays;
        FullPaymentRequired = fullPaymentRequired;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void SetActive(bool isActive, string performedBy)
    {
        IsActive = isActive;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void SoftDelete(string performedBy)
    {
        IsDeleted = true;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
