namespace Domain.Entities;

using Domain.Entities.Translations;

public class TourClassificationEntity : Aggregate<Guid>
{
    public Guid TourId { get; set; }
    public virtual TourEntity Tour { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal SalePrice { get; set; }
    public string Description { get; set; } = null!;
    public int DurationDays { get; set; }
    public Dictionary<string, TourClassificationTranslationData> Translations { get; set; } = [];
    public virtual List<TourDayEntity> Plans { get; set; } = [];
    public virtual List<TourInsuranceEntity> Insurances { get; set; } = [];

    public static TourClassificationEntity Create(Guid tourId, string name, decimal price, decimal salePrice, string description, int durationDays, string performedBy)
    {
        EnsureValidPricing(price, salePrice);
        EnsureValidDuration(durationDays);

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
        EnsureValidPricing(price, salePrice);
        EnsureValidDuration(durationDays);

        Name = name;
        Price = price;
        SalePrice = salePrice;
        Description = description;
        DurationDays = durationDays;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    private static void EnsureValidPricing(decimal price, decimal salePrice)
    {
        if (price < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(price), "Price must be non-negative.");
        }

        if (salePrice < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(salePrice), "Sale price must be non-negative.");
        }

        if (salePrice > price)
        {
            throw new ArgumentOutOfRangeException(nameof(salePrice), "Sale price must be less than or equal to price.");
        }
    }

    private static void EnsureValidDuration(int durationDays)
    {
        if (durationDays <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(durationDays), "Duration days must be greater than zero.");
        }
    }
}
