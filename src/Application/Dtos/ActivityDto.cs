namespace Application.Dtos;

public sealed record ActivityDto(
    string ActivityType,
    string Title,
    string? Description,
    string? Note,
    decimal? EstimatedCost,
    bool IsOptional,
    string? StartTime,
    string? EndTime,
    List<RouteDto>? Routes = null,
    AccommodationDto? Accommodation = null,
    Dictionary<string, ActivityTranslationData>? Translations = null);
