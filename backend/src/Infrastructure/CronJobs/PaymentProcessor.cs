using Application.Contracts.Payment;
using Domain.ApiThirdPatyResponse;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Infrastructure.CronJobs;

internal class PaymentProcessor(
    IServiceScopeFactory scopeFactory,
    IConfiguration configuration,
    ILogger<PaymentProcessor> logger) : BackgroundService
{
    private readonly HttpClient _httpClient = new();
    private readonly ILogger<PaymentProcessor> _logger = logger;
    private readonly string _authenticationKey = NormalizeConfigValue(configuration["Payment:AuthenticationKey"]);
    private readonly string _accountNumber = NormalizeConfigValue(configuration["Payment:Account"]);
    private readonly string _sepayApiBaseUrl = NormalizeConfigValue(configuration["Payment:ApiBaseUrl"]);
    private readonly int _pollingLimit = Math.Max(configuration.GetValue<int?>("Payment:PollingLimit") ?? 20, 1);
    private readonly TimeSpan _pollingInterval = TimeSpan.FromSeconds(Math.Max(configuration.GetValue<int?>("Payment:PollingIntervalSeconds") ?? 30, 5));

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (string.IsNullOrWhiteSpace(_authenticationKey)
            || string.IsNullOrWhiteSpace(_accountNumber)
            || string.IsNullOrWhiteSpace(_sepayApiBaseUrl))
        {
            _logger.LogWarning(
                "Payment processor disabled because required Payment configuration is missing. Configure Payment:AuthenticationKey, Payment:Account, and Payment:ApiBaseUrl.");
            return;
        }

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _authenticationKey);

        while (!stoppingToken.IsCancellationRequested)
        {
            var url = $"{_sepayApiBaseUrl.TrimEnd('/')}/userapi/transactions/list?account_number={Uri.EscapeDataString(_accountNumber)}&limit={_pollingLimit}";
            try
            {
                var response = await _httpClient.GetAsync(url, stoppingToken);
                response.EnsureSuccessStatusCode();
                string json = await response.Content.ReadAsStringAsync(stoppingToken);

                var transactions = JsonSerializer.Deserialize<SepayApiResponse>(json, JsonOptions);
                using var scope = scopeFactory.CreateScope();
                var sender = scope.ServiceProvider.GetRequiredService<ISender>();
                _ = await sender.Send(new ProcessPaymentCommand(transactions), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching transactions from SePay endpoint.");
            }

            await Task.Delay(_pollingInterval, stoppingToken);
        }
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
