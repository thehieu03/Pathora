namespace Api.Endpoint;

public static class TourInstanceEndpoint
{
    public const string Base = "api/tour-instance";
    public const string Id = "{id:guid}";
    public const string Stats = "stats";
    public const string ChangeStatus = "{id:guid}/status";
    public const string PricingTiers = "{id:guid}/pricing-tiers";
    public const string ClearPricingTiers = "{id:guid}/pricing-tiers/clear";
    public const string ResolvePricing = "{id:guid}/pricing/resolve";
}
