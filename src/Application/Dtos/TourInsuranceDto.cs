using Domain.Enums;

namespace Application.Dtos;

public sealed record TourInsuranceDto(
    Guid TourInsuranceId,
    string InsuranceName,
    InsuranceType InsuranceType,
    string InsuranceProvider,
    string CoverageDescription,
    decimal CoverageAmount,
    decimal CoverageFee,
    bool IsOptional,
    string? Note
);
