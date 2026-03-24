namespace Application.Dtos;

public sealed record ClassificationDto(
    string Name,
    string? Description,
    decimal AdultPrice,
    decimal ChildPrice,
    decimal InfantPrice,
    int NumberOfDay,
    int NumberOfNight,
    List<DayPlanDto>? Plans = null,
    List<InsuranceDto>? Insurances = null,
    Dictionary<string, ClassificationTranslationData>? Translations = null);
