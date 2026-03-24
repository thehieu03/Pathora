namespace Application.Dtos;

public sealed record DayPlanDto(
    int DayNumber,
    string Title,
    string? Description,
    List<ActivityDto>? Activities = null,
    Dictionary<string, DayPlanTranslationData>? Translations = null);
