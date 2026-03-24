namespace Application.Dtos;

public sealed record AccommodationDto(
    string AccommodationName,
    string? Address,
    string? ContactPhone,
    string? CheckInTime,
    string? CheckOutTime,
    string? Note,
    Dictionary<string, AccommodationTranslationData>? Translations = null);
