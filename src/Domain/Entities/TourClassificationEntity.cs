namespace Domain.Entities;

using Domain.Entities.Translations;

public class TourClassificationEntity : Aggregate<Guid>
{
    public Guid TourId { get; set; }
    public virtual TourEntity Tour { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal AdultPrice { get; set; }
    public decimal ChildPrice { get; set; }
    public decimal InfantPrice { get; set; }
    public string Description { get; set; } = null!;
    public int NumberOfDay { get; set; }
    public int NumberOfNight { get; set; }
    public Dictionary<string, TourClassificationTranslationData> Translations { get; set; } = [];
    public virtual List<TourDayEntity> Plans { get; set; } = [];
    public virtual List<TourInsuranceEntity> Insurances { get; set; } = [];
    public virtual List<DynamicPricingTierEntity> DynamicPricingTiers { get; set; } = [];

    public static TourClassificationEntity Create(Guid tourId, string name, decimal adultPrice, decimal childPrice, decimal infantPrice, string description, int numberOfDay, int numberOfNight, string performedBy)
    {
        return new TourClassificationEntity
        {
            Id = Guid.CreateVersion7(),
            TourId = tourId,
            Name = name,
            AdultPrice = adultPrice,
            ChildPrice = childPrice,
            InfantPrice = infantPrice,
            Description = description,
            NumberOfDay = numberOfDay,
            NumberOfNight = numberOfNight,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(string name, decimal adultPrice, decimal childPrice, decimal infantPrice, string description, int numberOfDay, int numberOfNight, string performedBy)
    {
        Name = name;
        AdultPrice = adultPrice;
        ChildPrice = childPrice;
        InfantPrice = infantPrice;
        Description = description;
        NumberOfDay = numberOfDay;
        NumberOfNight = numberOfNight;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
