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
    public decimal? RoomPrice { get; set; }
    public MealType MealsIncluded { get; set; }
    public string? SpecialRequest { get; set; }
    public string? Address { get; set; }
    public string? ContactPhone { get; set; }
    public string? Note { get; set; }
    public TourDayActivityEntity TourDayActivity { get; set; } = null!;

    public static TourPlanAccommodationEntity Create(string accommodationName, RoomType roomType, int roomCapacity, MealType mealsIncluded, string performedBy, TimeOnly? checkInTime = null, TimeOnly? checkOutTime = null, decimal? roomPrice = null, string? specialRequest = null, string? address = null, string? contactPhone = null, string? note = null)
    {
        return new TourPlanAccommodationEntity
        {
            Id = Guid.CreateVersion7(),
            TourPlanAccommodationId = Guid.CreateVersion7(),
            AccommodationName = accommodationName,
            CheckInTime = checkInTime,
            CheckOutTime = checkOutTime,
            RoomType = roomType,
            RoomCapacity = roomCapacity,
            RoomPrice = roomPrice,
            MealsIncluded = mealsIncluded,
            SpecialRequest = specialRequest,
            Address = address,
            ContactPhone = contactPhone,
            Note = note,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(string accommodationName, RoomType roomType, int roomCapacity, MealType mealsIncluded, string performedBy, TimeOnly? checkInTime = null, TimeOnly? checkOutTime = null, decimal? roomPrice = null, string? specialRequest = null, string? address = null, string? contactPhone = null, string? note = null)
    {
        AccommodationName = accommodationName;
        CheckInTime = checkInTime;
        CheckOutTime = checkOutTime;
        RoomType = roomType;
        RoomCapacity = roomCapacity;
        RoomPrice = roomPrice;
        MealsIncluded = mealsIncluded;
        SpecialRequest = specialRequest;
        Address = address;
        ContactPhone = contactPhone;
        Note = note;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}
