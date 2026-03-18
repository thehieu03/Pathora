using Application.Services;
using Domain.ApiThirdPatyResponse;
using Domain.Common.Repositories;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Api.Services;

public class OutboxWorkerService(
    IServiceProvider serviceProvider,
    ILogger<OutboxWorkerService> logger,
    IOptions<OutboxWorkerOptions> options,
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration)
    : BackgroundService
{
    private readonly OutboxWorkerOptions _options = options.Value;
    private readonly string _authenticationKey = NormalizeConfigValue(configuration["Payment:AuthenticationKey"]);
    private readonly string _accountNumber = NormalizeConfigValue(configuration["Payment:Account"]);
    private readonly string _sepayApiBaseUrl = NormalizeConfigValue(configuration["Payment:ApiBaseUrl"]);

    private static readonly TimeSpan[] RetryDelays =
    [
        TimeSpan.FromMinutes(1),
        TimeSpan.FromMinutes(5),
        TimeSpan.FromMinutes(30),
        TimeSpan.FromHours(2),
        TimeSpan.FromHours(6),
        TimeSpan.FromHours(12),
        TimeSpan.FromHours(24),
        TimeSpan.FromDays(2),
        TimeSpan.FromDays(3),
        TimeSpan.FromDays(7)
    ];

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Outbox Worker starting with interval {IntervalMs}ms", _options.PollingIntervalMs);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingMessagesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error processing outbox messages");
            }

            await Task.Delay(_options.PollingIntervalMs, stoppingToken);
        }

        logger.LogInformation("Outbox Worker stopped");
    }

    private async Task ProcessPendingMessagesAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var outboxRepository = scope.ServiceProvider.GetRequiredService<IOutboxRepository>();
        var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();

        var messages = await outboxRepository.GetPendingMessagesAsync(_options.BatchSize, cancellationToken);

        foreach (var message in messages)
        {
            if (cancellationToken.IsCancellationRequested)
                break;

            try
            {
                await ProcessMessageAsync(message, paymentService, outboxRepository, cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error processing outbox message {MessageId}", message.Id);
                var delay = GetRetryDelay(message.RetryCount);
                message.MarkAsFailed(ex.Message, delay);
                await outboxRepository.UpdateAsync(message, cancellationToken);
            }
        }
    }

    private async Task ProcessMessageAsync(
        OutboxMessage message,
        IPaymentService paymentService,
        IOutboxRepository outboxRepository,
        CancellationToken cancellationToken)
    {
        if (message.Type != "PaymentCheck")
        {
            logger.LogWarning("Unknown outbox message type: {Type}", message.Type);
            message.MarkAsDeadLetter("Unknown message type");
            await outboxRepository.UpdateAsync(message, cancellationToken);
            return;
        }

        var payload = JsonSerializer.Deserialize<PaymentCheckPayload>(message.Payload);
        if (payload == null)
        {
            message.MarkAsDeadLetter("Invalid payload");
            await outboxRepository.UpdateAsync(message, cancellationToken);
            return;
        }

        // Mark as processing
        message.MarkAsProcessing();
        await outboxRepository.UpdateAsync(message, cancellationToken);

        logger.LogInformation("Checking payment status for transaction {TransactionCode}, Amount: {Amount}",
            payload.TransactionCode, payload.Amount);

        // Check if payment configuration is available
        if (string.IsNullOrWhiteSpace(_authenticationKey) || string.IsNullOrWhiteSpace(_accountNumber))
        {
            logger.LogWarning("Payment configuration missing, skipping payment check for {TransactionCode}", payload.TransactionCode);
            // Don't mark as processed - will retry next interval
            message.MarkAsFailed("Payment configuration missing", TimeSpan.FromMinutes(5));
            await outboxRepository.UpdateAsync(message, cancellationToken);
            return;
        }

        try
        {
            // Call SePay API to check for matching transaction
            var matchedTransaction = await CheckPaymentFromSePayAsync(payload, cancellationToken);

            if (matchedTransaction != null)
            {
                // Process the payment
                var transactionData = new SepayTransactionData
                {
                    TransactionId = matchedTransaction.id ?? string.Empty,
                    BankBrandName = matchedTransaction.bank_brand_name,
                    AccountNumber = matchedTransaction.account_number,
                    TransactionDate = ParseDateTime(matchedTransaction.transaction_date),
                    Amount = ParseDecimal(matchedTransaction.amount_in),
                    TransactionContent = matchedTransaction.transaction_content,
                    ReferenceNumber = matchedTransaction.reference_number
                };

                var result = await paymentService.ProcessPaymentCallbackAsync(transactionData);

                if (result.IsError)
                {
                    logger.LogWarning("Failed to process payment for {TransactionCode}: {Errors}",
                        payload.TransactionCode, string.Join(", ", result.Errors.Select(e => e.Description)));
                    message.MarkAsFailed(string.Join(", ", result.Errors.Select(e => e.Description)), TimeSpan.FromMinutes(5));
                }
                else
                {
                    logger.LogInformation("Successfully processed payment for {TransactionCode}, Amount: {Amount}",
                        payload.TransactionCode, transactionData.Amount);
                    message.MarkAsProcessed();
                }
            }
            else
            {
                logger.LogDebug("No payment found for transaction {TransactionCode}, amount {Amount}",
                    payload.TransactionCode, payload.Amount);
                
                // Check if transaction has expired
                var transaction = await paymentService.GetTransactionByCodeAsync(payload.TransactionCode);
                if (transaction.IsError)
                {
                    message.MarkAsProcessed(); // Transaction not found, stop checking
                }
                else if (transaction.Value.IsExpired())
                {
                    await paymentService.ExpireTransactionAsync(payload.TransactionCode);
                    logger.LogInformation("Transaction {TransactionCode} has expired", payload.TransactionCode);
                    message.MarkAsProcessed();
                }
                else
                {
                    // Still pending, will retry on next interval
                    message.MarkAsFailed("Payment not received yet", TimeSpan.FromMinutes(5));
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error checking payment for {TransactionCode}", payload.TransactionCode);
            message.MarkAsFailed(ex.Message, TimeSpan.FromMinutes(5));
        }

        await outboxRepository.UpdateAsync(message, cancellationToken);
    }

    private async Task<Transaction?> CheckPaymentFromSePayAsync(PaymentCheckPayload payload, CancellationToken cancellationToken)
    {
        try
        {
            var httpClient = httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Clear();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _authenticationKey);

            var url = $"{_sepayApiBaseUrl.TrimEnd('/')}/userapi/transactions/list?account_number={Uri.EscapeDataString(_accountNumber)}&limit=50";
            var response = await httpClient.GetAsync(url, cancellationToken);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            var sepayResponse = JsonSerializer.Deserialize<SepayApiResponse>(json, JsonOptions);

            if (sepayResponse?.Transactions == null)
                return null;

            // Find matching transaction by content (contains transaction code) and amount
            var transactionCode = payload.TransactionCode;
            var expectedAmount = (long)payload.Amount;

            foreach (var transaction in sepayResponse.Transactions)
            {
                var amount = ParseDecimal(transaction.amount_in);
                var content = transaction.transaction_content ?? "";

                // Match by transaction code in content and amount
                if (content.Contains(transactionCode) && amount >= expectedAmount)
                {
                    logger.LogInformation("Found matching SePay transaction: {TransactionId}, Amount: {Amount}",
                        transaction.id, amount);
                    return transaction;
                }
            }

            return null;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error calling SePay API for transaction {TransactionCode}", payload.TransactionCode);
            throw;
        }
    }

    private static DateTimeOffset ParseDateTime(string? dateStr)
    {
        if (string.IsNullOrEmpty(dateStr))
            return DateTimeOffset.UtcNow;

        if (DateTimeOffset.TryParse(dateStr, out var parsed))
            return parsed;

        if (DateTimeOffset.TryParseExact(dateStr, new[] { "yyyy-MM-dd HH:mm:ss", "yyyy/MM/dd HH:mm:ss" },
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None,
            out parsed))
            return parsed;

        return DateTimeOffset.UtcNow;
    }

    private static decimal ParseDecimal(string? amountStr)
    {
        if (string.IsNullOrEmpty(amountStr))
            return 0;

        var cleaned = amountStr.Replace(",", "").Trim();

        if (decimal.TryParse(cleaned, out var result))
            return result;

        return 0;
    }

    private static TimeSpan GetRetryDelay(int retryCount)
    {
        if (retryCount >= RetryDelays.Length)
            return RetryDelays[^1];
        return RetryDelays[retryCount];
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

    private record PaymentCheckPayload(Guid TransactionId, string TransactionCode, Guid BookingId, decimal Amount, DateTimeOffset CreatedAt);
}

public class OutboxWorkerOptions
{
    public int PollingIntervalMs { get; set; } = 30000; // 30 seconds
    public int BatchSize { get; set; } = 10;
    public int MaxRetries { get; set; } = 10;
}
