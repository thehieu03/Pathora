namespace Domain.Entities;

using Domain.Entities.Translations;

public sealed class TourClassificationEntity : Aggregate<Guid>
{
    public Guid TourId { get; set; }
    public TourEntity Tour { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal SalePrice { get; set; }
    public string Description { get; set; } = null!;
    public int DurationDays { get; set; }
    public Dictionary<string, TourClassificationTranslationData> Translations { get; set; } = [];
    public List<TourDayEntity> Plans { get; set; } = [];
    public List<TourInsuranceEntity> Insurances { get; set; } = [];

    public static TourClassificationEntity Create(Guid tourId, string name, decimal price, decimal salePrice, string description, int durationDays, string performedBy)
    {
        return new TourClassificationEntity
        {
            Id = Guid.CreateVersion7(),
            TourId = tourId,
            Name = name,
            Price = price,
            SalePrice = salePrice,
            Description = description,
            DurationDays = durationDays,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(string name, decimal price, decimal salePrice, string description, int durationDays, string performedBy)
    {
        Name = name;
        Price = price;
        SalePrice = salePrice;
        Description = description;
        DurationDays = durationDays;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
