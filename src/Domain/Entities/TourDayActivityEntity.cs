namespace Domain.Entities;

public sealed class TourDayActivityEntity : Aggregate<Guid>
{
    public Guid TourDayId { get; set; }
    public TourDayEntity TourDay { get; set; } = null!;
    public int Order { get; set; }
    public TourDayActivityType ActivityType { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; } = null!;
    public string? Note { get; set; }

    // Time
    public TimeOnly? StartTime { get; set; } = null!;
    public TimeOnly? EndTime { get; set; } = null!;

    // Route
    public List<TourPlanRouteEntity> Routes { get; set; } = [];

    // Accommodation
    public TourPlanAccommodationEntity? Accommodation { get; set; } = null!;
}
