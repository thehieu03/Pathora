using Domain.Enums;

namespace Application.Dtos;

public sealed record TourDayActivityDto(
    Guid Id,
    Guid TourDayId,
    int Order,
    TourDayActivityType ActivityType,
    string Title,
    string? Description,
    string? Note,
    TimeOnly? StartTime,
    TimeOnly? EndTime,
    string? CreatedBy,
    DateTimeOffset CreatedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset? LastModifiedOnUtc
);
