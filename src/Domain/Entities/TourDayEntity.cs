namespace Domain.Entities;

public sealed class TourPlantEntity : Aggregate<Guid>
{
    public Guid ClassificationId { get; set; }
    public TourClassificationEntity Classification { get; set; } = null!;
    public int DayNumber { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
}