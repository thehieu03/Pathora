namespace Application.Dtos;

public sealed record TourClassificationDto(
    Guid Id,
    Guid TourId,
    string Name,
    decimal AdultPrice,
    decimal ChildPrice,
    decimal InfantPrice,
    string Description,
    int NumberOfDay,
    int NumberOfNight,
    List<TourDayDto> Plans,
    List<TourInsuranceDto> Insurances,
    string? CreatedBy,
    DateTimeOffset CreatedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset? LastModifiedOnUtc
);
