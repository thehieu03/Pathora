namespace Domain.Entities;

public class DynamicPricingTierEntity : Entity<Guid>
{
    public Guid TourInstanceId { get; set; }
    public virtual TourInstanceEntity TourInstance { get; set; } = null!;
    public int MinParticipants { get; set; }
    public int MaxParticipants { get; set; }
    public decimal PricePerPerson { get; set; }

    public static DynamicPricingTierEntity Create(Guid tourInstanceId, int minParticipants, int maxParticipants, decimal pricePerPerson, string performedBy)
    {
        if (minParticipants <= 0)
            throw new ArgumentOutOfRangeException(nameof(minParticipants), "Số người tối thiểu phải lớn hơn 0.");
        if (maxParticipants < minParticipants)
            throw new ArgumentOutOfRangeException(nameof(maxParticipants), "Số người tối đa phải lớn hơn hoặc bằng số người tối thiểu.");
        if (pricePerPerson < 0)
            throw new ArgumentOutOfRangeException(nameof(pricePerPerson), "Giá phải không âm.");

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
}
