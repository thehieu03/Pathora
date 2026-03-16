using Application.Common.Constant;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using ErrorOr;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public interface IPaymentService
{
    Task<ErrorOr<string>> GetQR(string note, long amount);
    Task<ErrorOr<PaymentTransactionEntity>> CreatePaymentTransactionAsync(
        Guid bookingId,
        TransactionType type,
        decimal amount,
        PaymentMethod paymentMethod,
        string paymentNote,
        string createdBy,
        int expirationMinutes = 30);
    Task<ErrorOr<PaymentTransactionEntity>> GetTransactionByCodeAsync(string transactionCode);
    Task<ErrorOr<PaymentTransactionEntity>> ProcessPaymentCallbackAsync(SepayTransactionData transactionData);
    Task<ErrorOr<PaymentTransactionEntity>> ExpireTransactionAsync(string transactionCode);
}

public class SepayTransactionData
{
    public string TransactionId { get; set; } = null!;
    public string? BankBrandName { get; set; }
    public string? AccountNumber { get; set; }
    public DateTimeOffset TransactionDate { get; set; }
    public decimal Amount { get; set; }
    public string? TransactionContent { get; set; }
    public string? ReferenceNumber { get; set; }
}

public class PaymentService : IPaymentService
{
    private const string OutboxTypePaymentCheck = "PaymentCheck";
    private readonly string _sepayAccountNumber;
    private readonly string _sepayBankCode;
    private readonly string _sepayQrBaseUrl;
    private readonly IPaymentTransactionRepository _transactionRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IOutboxRepository _outboxRepository;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(
        IPaymentTransactionRepository transactionRepository,
        IBookingRepository bookingRepository,
        IOutboxRepository outboxRepository,
        ILogger<PaymentService> logger,
        IConfiguration configuration)
    {
        _transactionRepository = transactionRepository;
        _bookingRepository = bookingRepository;
        _outboxRepository = outboxRepository;
        _logger = logger;
        _sepayAccountNumber = NormalizeConfigValue(configuration["Payment:Account"]);
        _sepayBankCode = NormalizeConfigValue(configuration["Payment:Bank"]);
        _sepayQrBaseUrl = NormalizeConfigValue(configuration["Payment:QrBaseUrl"]);
    }

    public Task<ErrorOr<string>> GetQR(string note, long amount)
    {
        if (string.IsNullOrWhiteSpace(_sepayAccountNumber)
            || string.IsNullOrWhiteSpace(_sepayBankCode)
            || string.IsNullOrWhiteSpace(_sepayQrBaseUrl))
        {
            return Task.FromResult<ErrorOr<string>>(
                Error.Failure(
                    ErrorConstants.Payment.PaymentProcessingFailedCode,
                    "Payment provider configuration is missing. Set Payment:Account, Payment:Bank, and Payment:QrBaseUrl."));
        }

        var encodedNote = Uri.EscapeDataString(note);
        var url = $"{_sepayQrBaseUrl.TrimEnd('/')}?acc={_sepayAccountNumber}&bank={_sepayBankCode}&amount={amount}&des={encodedNote}&template=TEMPLATE&download=false";
        return Task.FromResult<ErrorOr<string>>(url);
    }

    public async Task<ErrorOr<PaymentTransactionEntity>> CreatePaymentTransactionAsync(
        Guid bookingId,
        TransactionType type,
        decimal amount,
        PaymentMethod paymentMethod,
        string paymentNote,
        string createdBy,
        int expirationMinutes = 30)
    {
        var transactionCode = $"PAY-{DateTimeOffset.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
        var expiredAt = DateTimeOffset.UtcNow.AddMinutes(expirationMinutes);

        var transaction = PaymentTransactionEntity.Create(
            bookingId: bookingId,
            transactionCode: transactionCode,
            type: type,
            amount: amount,
            paymentMethod: paymentMethod,
            paymentNote: paymentNote,
            createdBy: createdBy,
            expiredAt: expiredAt);

        var qrUrl = await GetQR(paymentNote, (long)amount);
        if (qrUrl.IsError)
        {
            return qrUrl.Errors;
        }
        transaction.QRCodeUrl = qrUrl.Value;

        await _transactionRepository.AddAsync(transaction);

        // Create outbox message for background payment check
        var outboxPayload = System.Text.Json.JsonSerializer.Serialize(new
        {
            TransactionId = transaction.Id,
            TransactionCode = transactionCode,
            BookingId = bookingId,
            Amount = amount,
            CreatedAt = DateTimeOffset.UtcNow
        });
        var outboxMessage = OutboxMessage.Create(OutboxTypePaymentCheck, outboxPayload);
        await _outboxRepository.AddAsync(outboxMessage);

        _logger.LogInformation("Created outbox message {OutboxId} for payment check", outboxMessage.Id);

        return transaction;
    }

    public async Task<ErrorOr<PaymentTransactionEntity>> GetTransactionByCodeAsync(string transactionCode)
    {
        var transaction = await _transactionRepository.GetByTransactionCodeAsync(transactionCode);
        if (transaction == null)
        {
            return Error.NotFound(ErrorConstants.Payment.TransactionNotFoundCode, ErrorConstants.Payment.TransactionNotFoundDescription);
        }
        return transaction;
    }

    public async Task<ErrorOr<PaymentTransactionEntity>> ProcessPaymentCallbackAsync(SepayTransactionData transactionData)
    {
        var transactionCode = transactionData.TransactionContent?.Split(' ').FirstOrDefault();
        if (string.IsNullOrEmpty(transactionCode))
        {
            _logger.LogWarning("Could not extract transaction code from payment content: {Content}", transactionData.TransactionContent);
            return Error.Failure(ErrorConstants.Payment.PaymentProcessingFailedCode, ErrorConstants.Payment.PaymentProcessingFailedDescription);
        }

        var transaction = await _transactionRepository.GetByTransactionCodeAsync(transactionCode);
        if (transaction == null)
        {
            _logger.LogWarning("Transaction not found for code: {TransactionCode}", transactionCode);
            return Error.NotFound(ErrorConstants.Payment.TransactionNotFoundCode, ErrorConstants.Payment.TransactionNotFoundDescription);
        }

        // Idempotency: Check if already processed
        if (transaction.Status == TransactionStatus.Completed)
        {
            _logger.LogInformation("Transaction {TransactionCode} already processed, returning existing record", transactionCode);
            return transaction;
        }

        if (transaction.Status != TransactionStatus.Pending)
        {
            _logger.LogWarning("Transaction {TransactionCode} has unexpected status: {Status}", transactionCode, transaction.Status);
            return Error.Conflict(ErrorConstants.Payment.TransactionAlreadyCompletedCode, ErrorConstants.Payment.TransactionAlreadyCompletedDescription);
        }

        if (transaction.IsExpired())
        {
            transaction.MarkAsFailed("EXPIRED", ErrorConstants.Payment.TransactionExpiredDescription);
            await _transactionRepository.UpdateAsync(transaction);
            _logger.LogWarning("Transaction {TransactionCode} has expired", transactionCode);
            return Error.Conflict(ErrorConstants.Payment.TransactionExpiredCode, ErrorConstants.Payment.TransactionExpiredDescription);
        }

        // Mark transaction as paid
        transaction.MarkAsPaid(
            paidAmount: transactionData.Amount,
            paidAt: transactionData.TransactionDate,
            externalTransactionId: transactionData.TransactionId);

        transaction.SenderAccountNumber = transactionData.AccountNumber;
        transaction.BeneficiaryBank = transactionData.BankBrandName;

        await _transactionRepository.UpdateAsync(transaction);

        // Update booking status based on transaction type
        await UpdateBookingStatusAsync(transaction);

        _logger.LogInformation(
            "Payment processed successfully: TransactionCode={TransactionCode}, Amount={Amount}, BookingId={BookingId}",
            transaction.TransactionCode, transaction.PaidAmount, transaction.BookingId);

        return transaction;
    }

    private async Task UpdateBookingStatusAsync(PaymentTransactionEntity transaction)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(transaction.BookingId);
            if (booking == null)
            {
                _logger.LogWarning("Booking {BookingId} not found for transaction {TransactionCode}",
                    transaction.BookingId, transaction.TransactionCode);
                return;
            }

            // Update booking status based on transaction type
            switch (transaction.Type)
            {
                case TransactionType.Deposit:
                    if (booking.Status == BookingStatus.Pending || booking.Status == BookingStatus.Confirmed)
                    {
                        booking.MarkDeposited("SYSTEM");
                        _logger.LogInformation("Booking {BookingId} marked as Deposited via transaction {TransactionCode}",
                            booking.Id, transaction.TransactionCode);
                    }
                    break;

                case TransactionType.FullPayment:
                    if (booking.Status != BookingStatus.Paid && booking.Status != BookingStatus.Completed)
                    {
                        booking.MarkPaid("SYSTEM");
                        _logger.LogInformation("Booking {BookingId} marked as Paid via transaction {TransactionCode}",
                            booking.Id, transaction.TransactionCode);
                    }
                    break;

                default:
                    _logger.LogDebug("No booking status update for transaction type: {Type}", transaction.Type);
                    break;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update booking status for transaction {TransactionCode}", transaction.TransactionCode);
            // Don't fail the payment processing if booking update fails
        }
    }

    public async Task<ErrorOr<PaymentTransactionEntity>> ExpireTransactionAsync(string transactionCode)
    {
        var transaction = await _transactionRepository.GetByTransactionCodeAsync(transactionCode);
        if (transaction == null)
        {
            return Error.NotFound(ErrorConstants.Payment.TransactionNotFoundCode, ErrorConstants.Payment.TransactionNotFoundDescription);
        }

        if (transaction.Status != TransactionStatus.Pending)
        {
            return Error.Conflict(ErrorConstants.Payment.TransactionAlreadyCompletedCode, ErrorConstants.Payment.TransactionAlreadyCompletedDescription);
        }

        transaction.MarkAsFailed("EXPIRED", ErrorConstants.Payment.TransactionExpiredDescription);
        await _transactionRepository.UpdateAsync(transaction);

        return transaction;
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
