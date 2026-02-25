namespace Domain.Entities;

public sealed class TourDayEntity : Aggregate<Guid>
{
    public Guid TourDayId { get; set; }
    public TourClassificationEntity Classification { get; set; } = null!;
    public int DayNumber { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; } = null!;
    public List<TourDayActivityEntity> Activities { get; set; } = [];
}

