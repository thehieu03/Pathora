namespace Domain.Entities;

using Domain.Entities.Translations;

public class TourPlanRouteEntity : Aggregate<Guid>
{
    public int Order { get; set; }
    public TransportationType TransportationType { get; set; }
    public string? TransportationName { get; set; }
    public string? TransportationNote { get; set; }
    public TourPlanLocationEntity FromLocation { get; set; } = null!;
    public TourPlanLocationEntity ToLocation { get; set; } = null!;
    public TimeOnly? EstimatedDepartureTime { get; set; }
    public TimeOnly? EstimatedArrivalTime { get; set; }
    public int? DurationMinutes { get; set; }
    public decimal? DistanceKm { get; set; }
    public decimal? Price { get; set; }
    public string? BookingReference { get; set; }
    public string? Note { get; set; }
    public Dictionary<string, TourPlanRouteTranslationData> Translations { get; set; } = [];
    public TourDayActivityEntity TourDayActivity { get; set; } = null!;

    public static TourPlanRouteEntity Create(int order, TransportationType transportationType, string performedBy, string? transportationName = null, string? transportationNote = null, TimeOnly? estimatedDepartureTime = null, TimeOnly? estimatedArrivalTime = null, int? durationMinutes = null, decimal? distanceKm = null, decimal? price = null, string? bookingReference = null, string? note = null)
    {
        return new TourPlanRouteEntity
        {
            Id = Guid.CreateVersion7(),
            Order = order,
            TransportationType = transportationType,
            TransportationName = transportationName,
            TransportationNote = transportationNote,
            EstimatedDepartureTime = estimatedDepartureTime,
            EstimatedArrivalTime = estimatedArrivalTime,
            DurationMinutes = durationMinutes,
            DistanceKm = distanceKm,
            Price = price,
            BookingReference = bookingReference,
            Note = note,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(int order, TransportationType transportationType, string performedBy, string? transportationName = null, string? transportationNote = null, TimeOnly? estimatedDepartureTime = null, TimeOnly? estimatedArrivalTime = null, int? durationMinutes = null, decimal? distanceKm = null, decimal? price = null, string? bookingReference = null, string? note = null)
    {
        Order = order;
        TransportationType = transportationType;
        TransportationName = transportationName;
        TransportationNote = transportationNote;
        EstimatedDepartureTime = estimatedDepartureTime;
        EstimatedArrivalTime = estimatedArrivalTime;
        DurationMinutes = durationMinutes;
        DistanceKm = distanceKm;
        Price = price;
        BookingReference = bookingReference;
        Note = note;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}

