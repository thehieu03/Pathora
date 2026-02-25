using Domain.Enums;

namespace Application.Dtos;

public sealed record TourPlanAccommodationDto(
    Guid Id,
    string AccommodationName,
    TimeOnly? CheckInTime,
    TimeOnly? CheckOutTime,
    RoomType RoomType,
    int RoomCapacity,
    decimal? RoomPrice,
    MealType MealsIncluded,
    string? SpecialRequest,
    string? Address,
    string? ContactPhone,
    string? Note,
    string? CreatedBy,
    DateTimeOffset CreatedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset? LastModifiedOnUtc
);
