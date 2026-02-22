using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities;

public class TourPlanRouteEntity : Aggregate<Guid>
{
    public Guid TourPlanRouteId { get; set; }
    public int Order { get; set; }
    public TransportationType TransportationType { get; set; }
    public string? TransportationName { get; set; }
    public string? TransportationNote { get; set; }
    public TourPlanLocationEntity FromLocation { get; set; } = null!;
    public TourPlanLocationEntity ToLocation { get; set; } = null!;
    public TimeOnly? EstimatedDepartureTime { get; set; }
    public TimeOnly? EstimatedArrivalTime { get; set; }
    public int? DurationMinutes { get; set; }
    public decimal? Price { get; set; }                        
    public string? Note { get; set; }
    public TourDayActivityEntity TourDayActivity { get; set; } = null!;
  
}