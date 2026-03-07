namespace Domain.Entities;

using Domain.Entities.Translations;

public class TourPlanLocationEntity : Aggregate<Guid>
{
    public string LocationName { get; set; } = null!;
    public string? LocationDescription { get; set; }
    public LocationType LocationType { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? EntranceFee { get; set; }
    public TimeOnly? OpeningHours { get; set; }
    public TimeOnly? ClosingHours { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
    public string? Note { get; set; }
    public Dictionary<string, TourPlanLocationTranslationData> Translations { get; set; } = [];
    public virtual TourDayActivityEntity TourDayActivity { get; set; } = null!;

    public static TourPlanLocationEntity Create(string locationName, LocationType locationType, string performedBy, string? locationDescription = null, string? address = null, string? city = null, string? country = null, decimal? latitude = null, decimal? longitude = null, decimal? entranceFee = null, TimeOnly? openingHours = null, TimeOnly? closingHours = null, int? estimatedDurationMinutes = null, string? note = null)
    {
        return new TourPlanLocationEntity
        {
            Id = Guid.CreateVersion7(),
            LocationName = locationName,
            LocationDescription = locationDescription,
            LocationType = locationType,
            Address = address,
            City = city,
            Country = country,
            Latitude = latitude,
            Longitude = longitude,
            EntranceFee = entranceFee,
            OpeningHours = openingHours,
            ClosingHours = closingHours,
            EstimatedDurationMinutes = estimatedDurationMinutes,
            Note = note,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(string locationName, LocationType locationType, string performedBy, string? locationDescription = null, string? address = null, string? city = null, string? country = null, decimal? latitude = null, decimal? longitude = null, decimal? entranceFee = null, TimeOnly? openingHours = null, TimeOnly? closingHours = null, int? estimatedDurationMinutes = null, string? note = null)
    {
        LocationName = locationName;
        LocationDescription = locationDescription;
        LocationType = locationType;
        Address = address;
        City = city;
        Country = country;
        Latitude = latitude;
        Longitude = longitude;
        EntranceFee = entranceFee;
        OpeningHours = openingHours;
        ClosingHours = closingHours;
        EstimatedDurationMinutes = estimatedDurationMinutes;
        Note = note;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
