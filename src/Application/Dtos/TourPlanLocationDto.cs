using Domain.Enums;

namespace Application.Dtos;

public sealed record TourPlanLocationDto(
    Guid Id,
    Guid LocationId,
    string LocationName,
    string LocationDescription,
    LocationType LocationType,
    string? Address,
    string? City,
    string? Country,
    decimal? Latitude,
    decimal? Longitude,
    decimal? EntranceFee,
    string? Note,
    string? CreatedBy,
    DateTimeOffset CreatedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset? LastModifiedOnUtc
);
