namespace Domain.Entities;

public sealed class TourDayActivityEntity : Aggregate<Guid>
{
    public Guid TourDayId { get; set; }
    public TourDayEntity TourDay { get; set; } = null!;
    public int Order { get; set; }
    public TourDayActivityType ActivityType { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Note { get; set; }
    public decimal? EstimatedCost { get; set; }
    public bool IsOptional { get; set; }

    // Time
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }

    // Route
    public List<TourPlanRouteEntity> Routes { get; set; } = [];

    // Accommodation
    public TourPlanAccommodationEntity? Accommodation { get; set; }

    public static TourDayActivityEntity Create(Guid tourDayId, int order, TourDayActivityType activityType, string title, string performedBy, string? description = null, string? note = null, TimeOnly? startTime = null, TimeOnly? endTime = null, decimal? estimatedCost = null, bool isOptional = false)
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
            EstimatedCost = estimatedCost,
            IsOptional = isOptional,
            StartTime = startTime,
            EndTime = endTime,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(int order, TourDayActivityType activityType, string title, string performedBy, string? description = null, string? note = null, TimeOnly? startTime = null, TimeOnly? endTime = null, decimal? estimatedCost = null, bool isOptional = false)
    {
        Order = order;
        ActivityType = activityType;
        Title = title;
        Description = description;
        Note = note;
        EstimatedCost = estimatedCost;
        IsOptional = isOptional;
        StartTime = startTime;
        EndTime = endTime;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
