namespace Domain.Entities;

public class DynamicPricingTierEntity : Entity<Guid>
{
    public Guid? TourClassificationId { get; set; }
    public virtual TourClassificationEntity? TourClassification { get; set; }

    public Guid? TourInstanceId { get; set; }
    public virtual TourInstanceEntity? TourInstance { get; set; }

    public int MinParticipants { get; set; }
    public int MaxParticipants { get; set; }
    public decimal PricePerPerson { get; set; }

    public bool IsInstanceOwned => TourInstanceId.HasValue;
    public bool IsClassificationOwned => TourClassificationId.HasValue;

    public bool Matches(int participants)
    {
        return participants >= MinParticipants && participants <= MaxParticipants;
    }

    public bool Overlaps(int minParticipants, int maxParticipants)
    {
        return minParticipants <= MaxParticipants && maxParticipants >= MinParticipants;
    }

    public static DynamicPricingTierEntity CreateForTourInstance(Guid tourInstanceId, int minParticipants, int maxParticipants, decimal pricePerPerson, string performedBy)
    {
        EnsureValidRange(minParticipants, maxParticipants, pricePerPerson);

        return new DynamicPricingTierEntity
        {
            Id = Guid.CreateVersion7(),
            TourInstanceId = tourInstanceId,
            MinParticipants = minParticipants,
            MaxParticipants = maxParticipants,
            PricePerPerson = pricePerPerson,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public static DynamicPricingTierEntity CreateForClassification(Guid tourClassificationId, int minParticipants, int maxParticipants, decimal pricePerPerson, string performedBy)
    {
        EnsureValidRange(minParticipants, maxParticipants, pricePerPerson);

        return new DynamicPricingTierEntity
        {
            Id = Guid.CreateVersion7(),
            TourClassificationId = tourClassificationId,
            MinParticipants = minParticipants,
            MaxParticipants = maxParticipants,
            PricePerPerson = pricePerPerson,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public static bool HasOverlappingRanges(IEnumerable<DynamicPricingTierEntity> tiers)
    {
        var ordered = tiers
            .OrderBy(tier => tier.MinParticipants)
            .ThenBy(tier => tier.MaxParticipants)
            .ToList();

        for (var index = 1; index < ordered.Count; index++)
        {
            if (ordered[index].MinParticipants <= ordered[index - 1].MaxParticipants)
            {
                return true;
            }
        }

        return false;
    }

    private static void EnsureValidRange(int minParticipants, int maxParticipants, decimal pricePerPerson)
    {
        if (minParticipants <= 0)
            throw new ArgumentOutOfRangeException(nameof(minParticipants), "Số người tối thiểu phải lớn hơn 0.");
        if (maxParticipants < minParticipants)
            throw new ArgumentOutOfRangeException(nameof(maxParticipants), "Số người tối đa phải lớn hơn hoặc bằng số người tối thiểu.");
        if (pricePerPerson < 0)
            throw new ArgumentOutOfRangeException(nameof(pricePerPerson), "Giá phải không âm.");
    }
}
