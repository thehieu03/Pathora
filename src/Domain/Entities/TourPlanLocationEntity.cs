using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities;

public class TourPlanLocationEntity : Aggregate<Guid>
{
    public Guid LocationId { get; set; }
    public string LocationName { get; set; } = null!;
    public string LocationDescription { get; set; } = null!;
    public LocationType LocationType { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? EntranceFee { get; set; }
    public string? Note { get; set; }
    public TourDayActivityEntity TourDayActivity { get; set; } = null!;

    public static TourPlanLocationEntity Create(string locationName, string locationDescription, LocationType locationType, string performedBy, string? address = null, string? city = null, string? country = null, decimal? latitude = null, decimal? longitude = null, decimal? entranceFee = null, string? note = null)
    {
        return new TourPlanLocationEntity
        {
            Id = Guid.CreateVersion7(),
            LocationId = Guid.CreateVersion7(),
            LocationName = locationName,
            LocationDescription = locationDescription,
            LocationType = locationType,
            Address = address,
            City = city,
            Country = country,
            Latitude = latitude,
            Longitude = longitude,
            EntranceFee = entranceFee,
            Note = note,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(string locationName, string locationDescription, LocationType locationType, string performedBy, string? address = null, string? city = null, string? country = null, decimal? latitude = null, decimal? longitude = null, decimal? entranceFee = null, string? note = null)
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
        Note = note;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
