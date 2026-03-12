namespace Application.Dtos;

public sealed record DynamicPricingResolutionDto(
    decimal ResolvedPricePerPerson,
    string PricingSource,
    int? MinParticipants,
    int? MaxParticipants);
