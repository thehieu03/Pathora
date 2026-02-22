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
}
