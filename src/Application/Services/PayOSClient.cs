using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

using ErrorOr;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public interface IPayOSClient
{
    Task<ErrorOr<PayOSPaymentLinkResult>> CreatePaymentLinkAsync(PayOSPaymentLinkRequest request);
    bool VerifyWebhookSignature(string signature, string data);
}

public class PayOSPaymentLinkRequest
{
    public long OrderCode { get; set; }
    public long Amount { get; set; }
    public string Description { get; set; } = null!;
    public string ReturnUrl { get; set; } = null!;
    public string CancelUrl { get; set; } = null!;
}

public class PayOSPaymentLinkResult
{
    public string CheckoutUrl { get; set; } = null!;
    public string OrderCode { get; set; } = null!;
    public long Amount { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset ExpiredAt { get; set; }
}

public class PayOSClientImplementation : IPayOSClient
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _clientId;
    private readonly string _checksumKey;
    private readonly string _baseUrl;
    private readonly ILogger<PayOSClientImplementation> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public PayOSClientImplementation(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<PayOSClientImplementation> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _apiKey = NormalizeConfigValue(configuration["Payment:ApiKey"]);
        _clientId = NormalizeConfigValue(configuration["Payment:ClientId"]);
        _checksumKey = NormalizeConfigValue(configuration["Payment:ChecksumKey"]);
        _baseUrl = NormalizeConfigValue(configuration["Payment:PayOSApiUrl"]);

        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
    }

    public async Task<ErrorOr<PayOSPaymentLinkResult>> CreatePaymentLinkAsync(PayOSPaymentLinkRequest request)
    {
        if (string.IsNullOrWhiteSpace(_apiKey) || string.IsNullOrWhiteSpace(_clientId))
        {
            _logger.LogError("PayOS configuration is missing. ApiKey or ClientId is empty.");
            return Error.Failure("PAYOS_CONFIG_MISSING", "PayOS API key or Client ID is not configured.");
        }

        try
        {
            // Build data string for signature (sorted alphabetically by key)
            var dataString = $"amount={request.Amount}&cancelUrl={request.CancelUrl}&description={request.Description}&orderCode={request.OrderCode}&returnUrl={request.ReturnUrl}";
            _logger.LogInformation("PayOS data string for signature: {DataString}", dataString);

            var signature = GenerateSignature(dataString);
            _logger.LogInformation("PayOS signature: {Signature}", signature);

            // JSON payload for API body
            var payload = new
            {
                orderCode = request.OrderCode,
                amount = request.Amount,
                description = request.Description,
                returnUrl = request.ReturnUrl,
                cancelUrl = request.CancelUrl
            };

            var jsonPayload = JsonSerializer.Serialize(payload, _jsonOptions);
            _logger.LogInformation("PayOS request payload: {Payload}", jsonPayload);

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/v2/payment-requests")
            {
                Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
            };

            requestMessage.Headers.Add("x-client-id", _clientId);
            requestMessage.Headers.Add("x-api-key", _apiKey);
            requestMessage.Headers.Add("x-signature", signature);

            _logger.LogInformation("Creating PayOS payment link for order {OrderCode}, amount {Amount}",
                request.OrderCode, request.Amount);

            var response = await _httpClient.SendAsync(requestMessage);
            var responseContent = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("PayOS response: {StatusCode} - {Content}", response.StatusCode, responseContent);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("PayOS API error: {StatusCode} - {Content}",
                    response.StatusCode, responseContent);
                return Error.Failure("PAYOS_API_ERROR", $"PayOS API returned error: {response.StatusCode}");
            }

            var payosResponse = JsonSerializer.Deserialize<PayOSApiResponse>(responseContent, _jsonOptions);

            if (payosResponse == null || payosResponse.Code != "00")
            {
                _logger.LogError("PayOS API returned error code: {Code}, message: {Message}",
                    payosResponse?.Code, payosResponse?.Desc);
                return Error.Failure("PAYOS_API_ERROR", payosResponse?.Desc ?? "Unknown error from PayOS");
            }

            var data = payosResponse.Data;
            if (data == null)
            {
                return Error.Failure("PAYOS_NO_DATA", "PayOS response missing payment link data");
            }

            _logger.LogInformation("PayOS payment link created successfully: {CheckoutUrl}", data.CheckoutUrl);

            return new PayOSPaymentLinkResult
            {
                CheckoutUrl = data.CheckoutUrl ?? string.Empty,
                OrderCode = data.OrderCode.ToString(),
                Amount = data.Amount,
                CreatedAt = DateTimeOffset.FromUnixTimeSeconds(data.CreatedAt > 0 ? data.CreatedAt : DateTimeOffset.UtcNow.ToUnixTimeSeconds()),
                ExpiredAt = DateTimeOffset.FromUnixTimeSeconds(data.ExpiredAt > 0 ? data.ExpiredAt : DateTimeOffset.UtcNow.AddMinutes(15).ToUnixTimeSeconds())
            };
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error creating PayOS payment link");
            return Error.Failure("PAYOS_NETWORK_ERROR", "Failed to connect to PayOS API");
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "JSON error parsing PayOS response");
            return Error.Failure("PAYOS_PARSE_ERROR", "Failed to parse PayOS API response");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating PayOS payment link");
            return Error.Failure("PAYOS_UNEXPECTED_ERROR", "An unexpected error occurred");
        }
    }

    public bool VerifyWebhookSignature(string signature, string data)
    {
        if (string.IsNullOrWhiteSpace(_checksumKey) || string.IsNullOrWhiteSpace(signature))
        {
            _logger.LogWarning("Cannot verify webhook signature: missing checksum key or signature");
            return false;
        }

        try
        {
            var expectedSignature = GenerateSignature(data);
            return CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(expectedSignature),
                Encoding.UTF8.GetBytes(signature));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying PayOS webhook signature");
            return false;
        }
    }

    private string GenerateSignature(string data)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_checksumKey));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private static string NormalizeConfigValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var trimmed = value.Trim();
        if (trimmed.StartsWith("${", StringComparison.Ordinal) && trimmed.EndsWith("}", StringComparison.Ordinal))
        {
            return string.Empty;
        }

        return trimmed;
    }
}

// PayOS API Response DTOs
internal class PayOSApiResponse
{
    public string Code { get; set; } = null!;
    public string Desc { get; set; } = null!;
    public PayOSPaymentData? Data { get; set; }
}

internal class PayOSPaymentData
{
    public long OrderCode { get; set; }
    public long Amount { get; set; }
    public string? CheckoutUrl { get; set; }
    public long CreatedAt { get; set; }
    public long ExpiredAt { get; set; }
    public string? Status { get; set; }
}
