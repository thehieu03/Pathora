using Domain.Entities.Translations;
using Domain.Enums;

namespace Application.Features.Tour.Commands;

public sealed record ClassificationDto(
    string Name,
    string Description,
    decimal BasePrice,
    int NumberOfDay,
    int NumberOfNight,
    List<DayPlanDto> Plans,
    List<InsuranceDto> Insurances,
    Dictionary<string, TourClassificationTranslationData>? Translations = null
);

public sealed record DayPlanDto(
    int DayNumber,
    string Title,
    string? Description,
    List<ActivityDto> Activities,
    Dictionary<string, TourDayTranslationData>? Translations = null
);

public sealed record ActivityDto(
    string ActivityType,
    string Title,
    string? Description,
    string? Note,
    decimal? EstimatedCost,
    bool IsOptional,
    string? StartTime,
    string? EndTime,
    List<RouteDto> Routes,
    AccommodationDto? Accommodation,
    Dictionary<string, TourDayActivityTranslationData>? Translations = null
);

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
    Dictionary<string, TourPlanLocationTranslationData>? Translations = null,
    Dictionary<string, TourPlanRouteTranslationData>? RouteTranslations = null
);

public sealed record InsuranceDto(
    string InsuranceName,
    string InsuranceType,
    string InsuranceProvider,
    string CoverageDescription,
    decimal CoverageAmount,
    decimal CoverageFee,
    bool IsOptional,
    string? Note,
    Dictionary<string, TourClassificationTranslationData>? Translations = null
);

public sealed record AccommodationDto(
    string AccommodationName,
    string? Address,
    string? ContactPhone,
    string? CheckInTime,
    string? CheckOutTime,
    string? Note,
    Dictionary<string, TourPlanAccommodationTranslationData>? Translations = null
);

public sealed record LocationDto(
    string LocationName,
    string LocationType,
    string? Description,
    string? City,
    string? Country,
    decimal? EntranceFee,
    string? Address,
    Dictionary<string, TourPlanLocationTranslationData>? Translations = null
);

public sealed record ServiceDto(
    string ServiceName,
    string? PricingType,
    decimal? Price,
    decimal? SalePrice,
    string? Email,
    string? ContactNumber
);

public sealed record TransportationDto(
    string FromLocation,
    string ToLocation,
    string TransportationType,
    string? TransportationName,
    int? DurationMinutes,
    string? PricingType,
    decimal? Price,
    bool RequiresIndividualTicket,
    string? TicketInfo,
    string? Note,
    Dictionary<string, TourPlanRouteTranslationData>? Translations = null
);
