using System.Net.Http.Headers;
using System.Text.Json;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using ErrorOr;

using Application.Common.Constant;
using Domain.ApiThirdPatyResponse;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;

namespace Application.Services;

public sealed record PaymentStatusSnapshot(
    string TransactionCode,
    string NormalizedStatus,
    string RawStatus,
    string Source,
    bool VerifiedWithProvider,
    bool IsTerminal,
    DateTimeOffset CheckedAt,
    string? ProviderTransactionId);

public interface IPaymentReconciliationService
{
    Task<ErrorOr<PaymentStatusSnapshot>> GetNormalizedStatusAsync(string transactionCode);
    Task<ErrorOr<PaymentStatusSnapshot>> ReconcileReturnAsync(string transactionCode);
    Task<ErrorOr<PaymentStatusSnapshot>> ReconcileCancelAsync(string transactionCode);
    Task<ErrorOr<PaymentStatusSnapshot>> ReconcileProviderCallbackAsync(
        SepayTransactionData transactionData,
        string source = "webhook");
}

public sealed class PaymentReconciliationService(
    IPaymentTransactionRepository transactionRepository,
    IPaymentService paymentService,
    IUnitOfWork unitOfWork,
    IConfiguration configuration,
    ILogger<PaymentReconciliationService> logger) : IPaymentReconciliationService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly IPaymentTransactionRepository _transactionRepository = transactionRepository;
    private readonly IPaymentService _paymentService = paymentService;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly ILogger<PaymentReconciliationService> _logger = logger;
    private HttpClient _httpClient = new();

    private readonly string _authenticationKey = NormalizeConfigValue(configuration["Payment:AuthenticationKey"]);
    private readonly string _accountNumber = NormalizeConfigValue(configuration["Payment:Account"]);
    private readonly string _sepayApiBaseUrl = NormalizeConfigValue(configuration["Payment:ApiBaseUrl"]);

    public Task<ErrorOr<PaymentStatusSnapshot>> GetNormalizedStatusAsync(string transactionCode)
    {
        return ReconcileByTransactionCodeAsync(transactionCode, source: "status-check", verifyWithProviderIfPending: true);
    }

    public Task<ErrorOr<PaymentStatusSnapshot>> ReconcileReturnAsync(string transactionCode)
    {
        return ReconcileByTransactionCodeAsync(transactionCode, source: "return", verifyWithProviderIfPending: true);
    }

    public async Task<ErrorOr<PaymentStatusSnapshot>> ReconcileCancelAsync(string transactionCode)
    {
        var reconciliation = await ReconcileByTransactionCodeAsync(
            transactionCode,
            source: "cancel",
            verifyWithProviderIfPending: true);

        if (reconciliation.IsError)
        {
            return reconciliation.Errors;
        }

        if (!string.Equals(reconciliation.Value.NormalizedStatus, PaymentStatusMapper.Pending, StringComparison.Ordinal))
        {
            return reconciliation;
        }

        var transaction = await _transactionRepository.GetByTransactionCodeAsync(transactionCode);
        if (transaction == null)
        {
            return Error.NotFound(
                ErrorConstants.Payment.TransactionNotFoundCode,
                ErrorConstants.Payment.TransactionNotFoundDescription);
        }

        var previousStatus = transaction.Status.ToString();
        if (transaction.Status == TransactionStatus.Pending || transaction.Status == TransactionStatus.Processing)
        {
            transaction.MarkAsCancelled("SYSTEM");
            await _transactionRepository.UpdateAsync(transaction);
            await _unitOfWork.SaveChangeAsync();
        }

        var snapshot = BuildSnapshot(transaction, source: "cancel", reconciliation.Value.VerifiedWithProvider);
        LogTransition(
            source: "cancel",
            transactionCode: transaction.TransactionCode,
            previousStatus: previousStatus,
            currentStatus: transaction.Status.ToString(),
            normalizedStatus: snapshot.NormalizedStatus,
            verifiedWithProvider: snapshot.VerifiedWithProvider);

        return snapshot;
    }

    public async Task<ErrorOr<PaymentStatusSnapshot>> ReconcileProviderCallbackAsync(
        SepayTransactionData transactionData,
        string source = "webhook")
    {
        var transactionCode = ExtractTransactionCode(transactionData.TransactionContent);
        var previousStatus = "unknown";

        if (!string.IsNullOrWhiteSpace(transactionCode))
        {
            var existing = await _transactionRepository.GetByTransactionCodeAsync(transactionCode);
            if (existing != null)
            {
                previousStatus = existing.Status.ToString();
            }
        }

        var result = await _paymentService.ProcessSepayCallbackAsync(transactionData);
        if (result.IsError)
        {
            if (!string.IsNullOrWhiteSpace(transactionCode))
            {
                var existing = await _transactionRepository.GetByTransactionCodeAsync(transactionCode);
                if (existing != null)
                {
                    var existingSnapshot = BuildSnapshot(existing, source, verifiedWithProvider: false);
                    LogTransition(
                        source,
                        existing.TransactionCode,
                        previousStatus,
                        existing.Status.ToString(),
                        existingSnapshot.NormalizedStatus,
                        verifiedWithProvider: false);
                    return existingSnapshot;
                }
            }

            return result.Errors;
        }

        var snapshot = BuildSnapshot(result.Value, source, verifiedWithProvider: true, transactionData.TransactionId);

        LogTransition(
            source,
            result.Value.TransactionCode,
            previousStatus,
            result.Value.Status.ToString(),
            snapshot.NormalizedStatus,
            verifiedWithProvider: true);

        return snapshot;
    }

    private async Task<ErrorOr<PaymentStatusSnapshot>> ReconcileByTransactionCodeAsync(
        string transactionCode,
        string source,
        bool verifyWithProviderIfPending)
    {
        var transaction = await _transactionRepository.GetByTransactionCodeAsync(transactionCode);
        if (transaction == null)
        {
            return Error.NotFound(
                ErrorConstants.Payment.TransactionNotFoundCode,
                ErrorConstants.Payment.TransactionNotFoundDescription);
        }

        var previousStatus = transaction.Status.ToString();
        var verifiedWithProvider = false;

        if (verifyWithProviderIfPending
            && (transaction.Status == TransactionStatus.Pending || transaction.Status == TransactionStatus.Processing))
        {
            var verificationResult = await VerifyPendingTransactionWithProviderAsync(transaction);
            transaction = verificationResult.Transaction;
            verifiedWithProvider = verificationResult.Verified;
        }

        if ((transaction.Status == TransactionStatus.Pending || transaction.Status == TransactionStatus.Processing)
            && transaction.IsExpired())
        {
            transaction.MarkAsFailed("EXPIRED", ErrorConstants.Payment.TransactionExpiredDescription);
            await _transactionRepository.UpdateAsync(transaction);
            await _unitOfWork.SaveChangeAsync();
        }

        var snapshot = BuildSnapshot(transaction, source, verifiedWithProvider);
        LogTransition(
            source,
            transaction.TransactionCode,
            previousStatus,
            transaction.Status.ToString(),
            snapshot.NormalizedStatus,
            verifiedWithProvider: snapshot.VerifiedWithProvider);

        return snapshot;
    }

    private async Task<(PaymentTransactionEntity Transaction, bool Verified)> VerifyPendingTransactionWithProviderAsync(
        PaymentTransactionEntity transaction)
    {
        if (string.IsNullOrWhiteSpace(_authenticationKey)
            || string.IsNullOrWhiteSpace(_accountNumber)
            || string.IsNullOrWhiteSpace(_sepayApiBaseUrl))
        {
            _logger.LogDebug(
                "Skipping provider verification for {TransactionCode} because Payment configuration is incomplete.",
                transaction.TransactionCode);
            return (transaction, false);
        }

        var matchedProviderTransaction = await FetchMatchingProviderTransactionAsync(transaction);
        if (matchedProviderTransaction == null)
        {
            return (transaction, false);
        }

        var callbackData = new SepayTransactionData
        {
            TransactionId = matchedProviderTransaction.id ?? Guid.NewGuid().ToString(),
            BankBrandName = matchedProviderTransaction.bank_brand_name,
            AccountNumber = matchedProviderTransaction.account_number,
            TransactionDate = ParseDateTime(matchedProviderTransaction.transaction_date),
            Amount = ParseDecimal(matchedProviderTransaction.amount_in ?? matchedProviderTransaction.amount_out),
            TransactionContent = matchedProviderTransaction.transaction_content,
            ReferenceNumber = matchedProviderTransaction.reference_number
        };

        var processResult = await _paymentService.ProcessSepayCallbackAsync(callbackData);
        if (processResult.IsError)
        {
            _logger.LogWarning(
                "Provider verification found a transaction but reconciliation failed for {TransactionCode}: {Errors}",
                transaction.TransactionCode,
                string.Join(", ", processResult.Errors.Select(error => error.Description)));

            var latest = await _transactionRepository.GetByTransactionCodeAsync(transaction.TransactionCode);
            return (latest ?? transaction, false);
        }

        return (processResult.Value, true);
    }

    internal async Task<Transaction?> FetchMatchingProviderTransactionAsync(PaymentTransactionEntity transaction)
    {
        try
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _authenticationKey);

            var url = $"{_sepayApiBaseUrl.TrimEnd('/')}/userapi/transactions/list?account_number={Uri.EscapeDataString(_accountNumber)}&limit=50";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var providerResponse = JsonSerializer.Deserialize<SepayApiResponse>(json, JsonOptions);
            if (providerResponse?.Transactions == null || providerResponse.Transactions.Count == 0)
            {
                return null;
            }

            var expectedAmount = transaction.Amount;
            foreach (var providerTransaction in providerResponse.Transactions)
            {
                var providerContent = providerTransaction.transaction_content ?? string.Empty;
                var providerAmount = ParseDecimal(providerTransaction.amount_in ?? providerTransaction.amount_out);

                if (providerContent.Contains(transaction.TransactionCode, StringComparison.OrdinalIgnoreCase)
                    && providerAmount == expectedAmount)
                {
                    return providerTransaction;
                }
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to verify transaction {TransactionCode} with provider.",
                transaction.TransactionCode);
            return null;
        }
    }

    private static PaymentStatusSnapshot BuildSnapshot(
        PaymentTransactionEntity transaction,
        string source,
        bool verifiedWithProvider,
        string? providerTransactionId = null)
    {
        var normalizedStatus = PaymentStatusMapper.FromTransaction(transaction);
        return new PaymentStatusSnapshot(
            transaction.TransactionCode,
            normalizedStatus,
            transaction.Status.ToString(),
            source,
            verifiedWithProvider,
            PaymentStatusMapper.IsTerminal(normalizedStatus),
            DateTimeOffset.UtcNow,
            providerTransactionId ?? transaction.ExternalTransactionId);
    }

    private void LogTransition(
        string source,
        string transactionCode,
        string previousStatus,
        string currentStatus,
        string normalizedStatus,
        bool verifiedWithProvider)
    {
        _logger.LogInformation(
            "Payment reconciliation transition Source={Source} TransactionCode={TransactionCode} PreviousStatus={PreviousStatus} CurrentStatus={CurrentStatus} NormalizedStatus={NormalizedStatus} VerifiedWithProvider={VerifiedWithProvider}",
            source,
            transactionCode,
            previousStatus,
            currentStatus,
            normalizedStatus,
            verifiedWithProvider);
    }

    private static string? ExtractTransactionCode(string? paymentContent)
    {
        if (string.IsNullOrWhiteSpace(paymentContent))
        {
            return null;
        }

        return paymentContent.Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
    }

    private static DateTimeOffset ParseDateTime(string? dateStr)
    {
        if (string.IsNullOrWhiteSpace(dateStr))
        {
            return DateTimeOffset.UtcNow;
        }

        if (DateTimeOffset.TryParse(dateStr, out var parsed))
        {
            return parsed;
        }

        return DateTimeOffset.UtcNow;
    }

    private static decimal ParseDecimal(string? amountStr)
    {
        if (string.IsNullOrWhiteSpace(amountStr))
        {
            return decimal.Zero;
        }

        var cleaned = amountStr.Replace(",", string.Empty, StringComparison.Ordinal).Trim();
        if (decimal.TryParse(cleaned, out var parsedAmount))
        {
            return parsedAmount;
        }

        return decimal.Zero;
    }

    private static string NormalizeConfigValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var trimmed = value.Trim();
        if (trimmed.StartsWith("${", StringComparison.Ordinal)
            && trimmed.EndsWith("}", StringComparison.Ordinal))
        {
            return string.Empty;
        }

        return trimmed;
    }
}
