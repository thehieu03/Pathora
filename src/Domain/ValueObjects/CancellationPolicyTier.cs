using System.Text.Json.Serialization;

namespace Domain.ValueObjects;

[JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
public sealed record CancellationPolicyTier(
    int MinDaysBeforeDeparture,
    int MaxDaysBeforeDeparture,
    decimal PenaltyPercentage)
{
    public static CancellationPolicyTier? Create(int min, int max, decimal penalty)
    {
        if (min < 0 || max < min || penalty < 0 || penalty > 100)
            return null;
        return new CancellationPolicyTier(min, max, penalty);
    }
}
