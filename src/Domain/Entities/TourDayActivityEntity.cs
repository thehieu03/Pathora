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

    public static TourDayActivityEntity Create(Guid tourDayId, int order, TourDayActivityType activityType, string title, string performedBy, string? description = null, string? note = null, TimeOnly? startTime = null, TimeOnly? endTime = null)
    {
        return new TourDayActivityEntity
        {
            Id = Guid.CreateVersion7(),
            TourDayId = tourDayId,
            Order = order,
            ActivityType = activityType,
            Title = title,
            Description = description,
            Note = note,
            StartTime = startTime,
            EndTime = endTime,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(int order, TourDayActivityType activityType, string title, string performedBy, string? description = null, string? note = null, TimeOnly? startTime = null, TimeOnly? endTime = null)
    {
        Order = order;
        ActivityType = activityType;
        Title = title;
        Description = description;
        Note = note;
        StartTime = startTime;
        EndTime = endTime;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
