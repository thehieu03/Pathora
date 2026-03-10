namespace Application.Dtos;

public sealed record DynamicPricingDto(
    int MinParticipants,
    int MaxParticipants,
    decimal PricePerPerson);
