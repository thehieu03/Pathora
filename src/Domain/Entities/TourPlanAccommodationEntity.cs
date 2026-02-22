using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities;
public class TourPlanAccommodationEntity : Aggregate<Guid>
{
    public Guid TourPlanAccommodationId { get; set; }
    public string AccommodationName { get; set; } = null!;
    public TimeOnly? CheckInTime { get; set; }
    public TimeOnly? CheckOutTime { get; set; }
    public RoomType RoomType { get; set; } 
    public int RoomCapacity { get; set; }
    // Double/Twin/Family...
    public decimal? RoomPrice { get; set; }
    public MealType MealsIncluded { get; set; }
    public string? SpecialRequest { get; set; }              
    public string? Address { get; set; }                       
    public string? ContactPhone { get; set; }                   
    public string? Note { get; set; }
    public TourDayActivityEntity TourDayActivity { get; set; } = null!;

}
