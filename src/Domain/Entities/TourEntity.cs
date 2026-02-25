namespace Domain.Entities;

public class TourEntity : Aggregate<Guid>
{
    public string TourCode { get; set; } = null!;
    public string TourName { get; set; } = null!;
    public string ShortDescription { get; set; } = null!;
    public string LongDescription { get; set; } = null!;
    public bool IsDeleted { get; set; } = false;
    public string? SEOTitle { get; set; }
    public string? SEODescription { get; set; }
    public TourStatus Status { get; set; } = TourStatus.Pending;
    public ImageEntity Thumbnail { get; set; } = null!;
    public List<ImageEntity> Images { get; set; } = [];
    public List<TourClassificationEntity> Classifications { get; set; } = [];

    public static TourEntity Create(string tourCode, string tourName, string shortDescription, string longDescription, string performedBy, TourStatus status = TourStatus.Pending, string? seoTitle = null, string? seoDescription = null)
    {
        return new TourEntity
        {
            Id = Guid.CreateVersion7(),
            TourCode = tourCode,
            TourName = tourName,
            ShortDescription = shortDescription,
            LongDescription = longDescription,
            SEOTitle = seoTitle,
            SEODescription = seoDescription,
            Status = status,
            Thumbnail = new ImageEntity(),
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(string tourCode, string tourName, string shortDescription, string longDescription, TourStatus status, string performedBy, string? seoTitle = null, string? seoDescription = null)
    {
        TourCode = tourCode;
        TourName = tourName;
        ShortDescription = shortDescription;
        LongDescription = longDescription;
        SEOTitle = seoTitle;
        SEODescription = seoDescription;
        Status = status;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void SoftDelete(string performedBy)
    {
        IsDeleted = true;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
