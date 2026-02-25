using Domain.Enums;

namespace Application.Dtos;

public sealed record TourPlanRouteDto(
    Guid Id,
    int Order,
    TransportationType TransportationType,
    string? TransportationName,
    string? TransportationNote,
    TourPlanLocationDto? FromLocation,
    TourPlanLocationDto? ToLocation,
    TimeOnly? EstimatedDepartureTime,
    TimeOnly? EstimatedArrivalTime,
    int? DurationMinutes,
    decimal? Price,
    string? Note,
    string? CreatedBy,
    DateTimeOffset CreatedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset? LastModifiedOnUtc
);
