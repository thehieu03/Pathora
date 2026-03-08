namespace Application.Dtos;

public sealed record TourInstanceVm(
    Guid Id,
    Guid TourId,
    string TourName,
    string TourCode,
    string ClassificationName,
    string? Location,
    ImageDto? Thumbnail,
    DateTimeOffset StartDate,
    DateTimeOffset EndDate,
    int DurationDays,
    int RegisteredParticipants,
    int MaxParticipants,
    int MinParticipants,
    decimal Price,
    string Status,
    string InstanceType);
