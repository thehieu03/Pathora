namespace Domain.Entities;

using Domain.Entities.Translations;

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
    public Dictionary<string, TourTranslationData> Translations { get; set; } = [];
    public List<TourClassificationEntity> Classifications { get; set; } = [];

    public static string GenerateTourCode()
    {
        var datePart = DateTimeOffset.UtcNow.ToString("yyyyMMdd");
        var uniquePart = Guid.CreateVersion7().ToString("N")[..8];
        return $"TOUR-{datePart}-{uniquePart}";
    }

    public static TourEntity Create(string tourName, string shortDescription, string longDescription, string performedBy, TourStatus status = TourStatus.Pending, string? seoTitle = null, string? seoDescription = null, ImageEntity? thumbnail = null, List<ImageEntity>? images = null)
    {
        return new TourEntity
        {
            Id = Guid.CreateVersion7(),
            TourCode = GenerateTourCode(),
            TourName = tourName,
            ShortDescription = shortDescription,
            LongDescription = longDescription,
            SEOTitle = seoTitle,
            SEODescription = seoDescription,
            Status = status,
            Thumbnail = thumbnail ?? new ImageEntity(),
            Images = images ?? [],
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(string tourName, string shortDescription, string longDescription, TourStatus status, string performedBy, string? seoTitle = null, string? seoDescription = null, ImageEntity? thumbnail = null, List<ImageEntity>? images = null)
    {
        TourName = tourName;
        ShortDescription = shortDescription;
        LongDescription = longDescription;
        SEOTitle = seoTitle;
        SEODescription = seoDescription;
        Status = status;
        if (thumbnail is not null)
        {
            Thumbnail.FileId = thumbnail.FileId;
            Thumbnail.OriginalFileName = thumbnail.OriginalFileName;
            Thumbnail.FileName = thumbnail.FileName;
            Thumbnail.PublicURL = thumbnail.PublicURL;
        }
        if (images is not null)
        {
            Images.Clear();
            Images.AddRange(images);
        }
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
