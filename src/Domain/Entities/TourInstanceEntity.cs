namespace Domain.Entities;

using Domain.ValueObjects;

public class TourInstanceEntity : Aggregate<Guid>
{
    public Guid TourId { get; set; }
    public virtual TourEntity Tour { get; set; } = null!;
    public Guid ClassificationId { get; set; }
    public virtual TourClassificationEntity Classification { get; set; } = null!;

    public string TourName { get; set; } = null!;
    public string TourCode { get; set; } = null!;
    public string ClassificationName { get; set; } = null!;
    public string? Location { get; set; }
    public ImageEntity Thumbnail { get; set; } = null!;

    public TourType InstanceType { get; set; } = TourType.Public;
    public TourInstanceStatus Status { get; set; } = TourInstanceStatus.Available;

    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset EndDate { get; set; }
    public int DurationDays { get; set; }

    public int MinParticipants { get; set; }
    public int MaxParticipants { get; set; }
    public int RegisteredParticipants { get; set; }

    public decimal Price { get; set; }
    public decimal SalePrice { get; set; }
    public string? Category { get; set; }
    public DateTimeOffset? ConfirmationDeadline { get; set; }

    public List<string> IncludedServices { get; set; } = [];
    public TourInstanceGuide? Guide { get; set; }
    public virtual List<DynamicPricingTierEntity> DynamicPricingTiers { get; set; } = [];

    public bool IsDeleted { get; set; }

    public static TourInstanceEntity Create(
        Guid tourId,
        Guid classificationId,
        string tourName,
        string tourCode,
        string classificationName,
        TourType instanceType,
        DateTimeOffset startDate,
        DateTimeOffset endDate,
        int durationDays,
        int minParticipants,
        int maxParticipants,
        decimal price,
        decimal salePrice,
        string performedBy,
        string? location = null,
        ImageEntity? thumbnail = null,
        string? category = null,
        DateTimeOffset? confirmationDeadline = null,
        List<string>? includedServices = null,
        TourInstanceGuide? guide = null)
    {
        EnsureValidDateRange(startDate, endDate);
        EnsureValidParticipants(minParticipants, maxParticipants);

        return new TourInstanceEntity
        {
            Id = Guid.CreateVersion7(),
            TourId = tourId,
            ClassificationId = classificationId,
            TourName = tourName,
            TourCode = tourCode,
            ClassificationName = classificationName,
            InstanceType = instanceType,
            Status = TourInstanceStatus.Available,
            StartDate = startDate,
            EndDate = endDate,
            DurationDays = durationDays,
            MinParticipants = minParticipants,
            MaxParticipants = maxParticipants,
            RegisteredParticipants = 0,
            Price = price,
            SalePrice = salePrice,
            Location = location,
            Thumbnail = thumbnail ?? new ImageEntity(),
            Category = category,
            ConfirmationDeadline = confirmationDeadline,
            IncludedServices = includedServices ?? [],
            Guide = guide,
            IsDeleted = false,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(
        DateTimeOffset startDate,
        DateTimeOffset endDate,
        int minParticipants,
        int maxParticipants,
        decimal price,
        decimal salePrice,
        string performedBy,
        string? location = null,
        string? category = null,
        DateTimeOffset? confirmationDeadline = null,
        List<string>? includedServices = null,
        TourInstanceGuide? guide = null)
    {
        EnsureValidDateRange(startDate, endDate);
        EnsureValidParticipants(minParticipants, maxParticipants);

        StartDate = startDate;
        EndDate = endDate;
        MinParticipants = minParticipants;
        MaxParticipants = maxParticipants;
        Price = price;
        SalePrice = salePrice;
        Location = location;
        Category = category;
        ConfirmationDeadline = confirmationDeadline;
        if (includedServices is not null)
            IncludedServices = includedServices;
        Guide = guide;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void ChangeStatus(TourInstanceStatus newStatus)
    {
        EnsureValidTransition(Status, newStatus);
        Status = newStatus;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void SoftDelete(string performedBy)
    {
        IsDeleted = true;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    private static void EnsureValidDateRange(DateTimeOffset startDate, DateTimeOffset endDate)
    {
        if (startDate >= endDate)
            throw new ArgumentException("Ngày bắt đầu phải trước ngày kết thúc.");
    }

    private static void EnsureValidParticipants(int minParticipants, int maxParticipants)
    {
        if (minParticipants < 0)
            throw new ArgumentOutOfRangeException(nameof(minParticipants), "Số người tối thiểu không được âm.");
        if (maxParticipants <= 0)
            throw new ArgumentOutOfRangeException(nameof(maxParticipants), "Số người tối đa phải lớn hơn 0.");
        if (minParticipants > maxParticipants)
            throw new ArgumentOutOfRangeException(nameof(minParticipants), "Số người tối thiểu phải nhỏ hơn hoặc bằng số người tối đa.");
    }

    private static void EnsureValidTransition(TourInstanceStatus current, TourInstanceStatus next)
    {
        var valid = current switch
        {
            TourInstanceStatus.Available => next is TourInstanceStatus.Confirmed or TourInstanceStatus.SoldOut or TourInstanceStatus.Cancelled,
            TourInstanceStatus.Confirmed => next is TourInstanceStatus.InProgress or TourInstanceStatus.Cancelled,
            TourInstanceStatus.SoldOut => next is TourInstanceStatus.Confirmed or TourInstanceStatus.Cancelled,
            TourInstanceStatus.InProgress => next is TourInstanceStatus.Completed,
            _ => false
        };

        if (!valid)
            throw new InvalidOperationException($"Không thể chuyển trạng thái từ {current} sang {next}.");
    }
}
