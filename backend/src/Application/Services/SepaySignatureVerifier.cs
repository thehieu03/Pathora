using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public interface ISepaySignatureVerifier
{
    bool Verify(string rawBody, string signature);
}

public class SepaySignatureVerifier : ISepaySignatureVerifier
{
    private readonly string _secret;
    private readonly ILogger<SepaySignatureVerifier> _logger;

    public SepaySignatureVerifier(IConfiguration configuration, ILogger<SepaySignatureVerifier> logger)
    {
        _secret = NormalizeConfigValue(configuration["Payment:SepayWebhookSecret"]);
        _logger = logger;
    }

    public bool Verify(string rawBody, string signature)
    {
        if (string.IsNullOrWhiteSpace(_secret))
        {
            _logger.LogWarning("Sepay webhook verification skipped: SepayWebhookSecret is not configured");
            return true;
        }

        if (string.IsNullOrWhiteSpace(signature))
        {
            _logger.LogWarning("Sepay webhook verification skipped: signature is missing");
            return false;
        }

        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_secret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawBody));
        var expected = Convert.ToHexString(hash).ToLowerInvariant();

        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(expected),
            Encoding.UTF8.GetBytes(signature.ToLowerInvariant()));
    }

    private static string NormalizeConfigValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        var trimmed = value.Trim();
        if (trimmed.StartsWith("${", StringComparison.Ordinal) && trimmed.EndsWith("}", StringComparison.Ordinal))
            return string.Empty;

        return trimmed;
    }
}
