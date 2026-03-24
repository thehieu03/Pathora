namespace Application.Dtos;

public sealed record LocationDto(
    string LocationName,
    string? LocationDescription,
    string? Address,
    string? City,
    string? Country,
    string? LocationType,
    Dictionary<string, LocationTranslationData>? Translations = null);
