namespace Domain.Entities;

using Domain.Entities.Translations;

public sealed class TourDayEntity : Aggregate<Guid>
{
    public Guid TourClassificationId { get; set; }
    public TourClassificationEntity Classification { get; set; } = null!;
    public int DayNumber { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; } = null!;
    public Dictionary<string, TourDayTranslationData> Translations { get; set; } = [];
    public List<TourDayActivityEntity> Activities { get; set; } = [];

    public static TourDayEntity Create(Guid classificationId, int dayNumber, string title, string performedBy, string? description = null)
    {
        return new TourDayEntity
        {
            Id = Guid.CreateVersion7(),
            TourClassificationId = classificationId,
            DayNumber = dayNumber,
            Title = title,
            Description = description,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(int dayNumber, string title, string performedBy, string? description = null)
    {
        DayNumber = dayNumber;
        Title = title;
        Description = description;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}

