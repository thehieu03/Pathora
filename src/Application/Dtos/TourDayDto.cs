namespace Application.Dtos;

public sealed record TourDayDto(
    Guid Id,
    Guid ClassificationId,
    int DayNumber,
    string Title,
    string? Description,
    string? CreatedBy,
    DateTimeOffset CreatedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset? LastModifiedOnUtc
);
