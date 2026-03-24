namespace Application.Dtos;

public sealed record TourClassificationDto(
    Guid Id,
    Guid TourId,
    string Name,
    decimal BasePrice,
    string Description,
    int NumberOfDay,
    int NumberOfNight,
    List<DynamicPricingDto>? DynamicPricing,
    List<TourDayDto> Plans,
    List<TourInsuranceDto> Insurances,
    string? CreatedBy,
    DateTimeOffset CreatedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset? LastModifiedOnUtc
);
