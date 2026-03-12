namespace Domain.Entities;

public class BookingTourGuideEntity : Aggregate<Guid>
{
    public Guid BookingId { get; set; }
    public virtual BookingEntity Booking { get; set; } = null!;
    public Guid UserId { get; set; }
    public virtual UserEntity User { get; set; } = null!;
    public Guid? TourGuideId { get; set; }
    public virtual TourGuideEntity? TourGuide { get; set; }

    public AssignedRole AssignedRole { get; set; }
    public bool IsLead { get; set; }
    public DateTimeOffset AssignedDate { get; set; }
    public Guid? AssignedBy { get; set; }
    public AssignmentStatus Status { get; set; } = AssignmentStatus.Assigned;
    public string? Note { get; set; }

    public static BookingTourGuideEntity Create(
        Guid bookingId,
        Guid userId,
        AssignedRole assignedRole,
        string performedBy,
        Guid? tourGuideId = null,
        bool isLead = false,
        Guid? assignedBy = null,
        string? note = null)
    {
        return new BookingTourGuideEntity
        {
            Id = Guid.CreateVersion7(),
            BookingId = bookingId,
            UserId = userId,
            TourGuideId = tourGuideId,
            AssignedRole = assignedRole,
            IsLead = isLead,
            AssignedDate = DateTimeOffset.UtcNow,
            AssignedBy = assignedBy,
            Status = AssignmentStatus.Assigned,
            Note = note,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(
        AssignedRole assignedRole,
        string performedBy,
        Guid? tourGuideId = null,
        bool? isLead = null,
        AssignmentStatus? status = null,
        string? note = null)
    {
        AssignedRole = assignedRole;
        TourGuideId = tourGuideId;
        IsLead = isLead ?? IsLead;
        Status = status ?? Status;
        Note = note;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
