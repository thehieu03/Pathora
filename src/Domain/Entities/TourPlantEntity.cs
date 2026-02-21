namespace Domain.Entities;

public sealed class TourDayEntity : Aggregate<Guid>
{
    public Guid ClassificationId { get; set; }
    public TourClassificationEntity Classification { get; set; } = null!;
    public int DayNumber { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;

    // Nơi lưu trú trong đêm của ngày này
    public string? AccommodationName { get; set; }
    public string? AccommodationNote { get; set; }

    // Danh sách các hoạt động / địa điểm trong ngày
    public List<TourDayActivityEntity> Activities { get; set; } = [];
}