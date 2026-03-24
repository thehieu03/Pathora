namespace Application.Dtos;

public sealed record InsuranceDto(
    string InsuranceName,
    string InsuranceType,
    string? InsuranceProvider,
    string? CoverageDescription,
    decimal? CoverageAmount,
    decimal CoverageFee,
    bool IsOptional,
    string? Note,
    Dictionary<string, InsuranceTranslationData>? Translations = null);
