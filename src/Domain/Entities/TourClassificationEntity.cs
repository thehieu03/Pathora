namespace Domain.Entities;

public sealed class TourClassificationEntity : Aggregate<Guid>
{
    public Guid TourClassificationId { get; set; }
    public TourEntity Tour { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal SalePrice { get; set; }
    public string Description { get; set; } = null!;
    public int DurationDays { get; set; }
    public List<TourDayEntity> Plans { get; set; } = [];
    public List<TourInsuranceEntity> Insurances { get; set; } = [];
}
