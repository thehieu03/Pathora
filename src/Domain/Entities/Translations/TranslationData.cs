namespace Domain.Entities.Translations;

public sealed class TourTranslationData
{
    public string TourName { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string LongDescription { get; set; } = string.Empty;
    public string? SEOTitle { get; set; }
    public string? SEODescription { get; set; }
}

public sealed class TourClassificationTranslationData
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public sealed class TourDayTranslationData
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public sealed class TourDayActivityTranslationData
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Note { get; set; }
}

public sealed class TourPlanLocationTranslationData
{
    public string LocationName { get; set; } = string.Empty;
    public string? LocationDescription { get; set; }
    public string? Note { get; set; }
}

public sealed class TourPlanAccommodationTranslationData
{
    public string AccommodationName { get; set; } = string.Empty;
    public string? SpecialRequest { get; set; }
    public string? Note { get; set; }
}

public sealed class TourPlanRouteTranslationData
{
    public string? TransportationName { get; set; }
    public string? TransportationNote { get; set; }
    public string? Note { get; set; }
}

public sealed class TourInstanceTranslationData
{
    public string Title { get; set; } = string.Empty;
    public string? Location { get; set; }
    public List<string> IncludedServices { get; set; } = [];
    public string? CancellationReason { get; set; }
}
