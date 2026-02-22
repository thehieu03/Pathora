namespace Domain.Entities;

public sealed class TourDayActivityEntity : Aggregate<Guid>
{
    public Guid TourDayActivityId { get; set; }
    public TourDayEntity TourDay { get; set; } = null!;
    public int Order { get; set; }
    public TourDayActivityType ActivityType { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; } = null!;
    public string? Note { get; set; }

    // Time
    public TimeOnly? StartTime { get; set; } = null!;
    public TimeOnly? EndTime { get; set; } = null!;

    // Location 
    public TourPlanLocationEntity? FromLocation { get; set; }
    public TourPlanLocationEntity? ToLocation { get; set; }
    public string? DestinationNote { get; set; }

    // Route
    public List<TourPlanRouteEntity> Routes { get; set; } = [];

    // Accommodation
    public TourPlanAccommodationEntity? Accommodation { get; set; } = null!;
}
