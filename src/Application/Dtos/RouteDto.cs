namespace Application.Dtos;

public sealed record RouteDto(
    string FromLocationName,
    string ToLocationName,
    string TransportationType,
    string? TransportationName,
    int? DurationMinutes,
    string? PricingType,
    decimal? Price,
    bool RequiresIndividualTicket,
    string? TicketInfo,
    string? Note,
    List<RouteTranslationData>? RouteTranslations = null,
    List<LocationTranslationData>? Translations = null);
