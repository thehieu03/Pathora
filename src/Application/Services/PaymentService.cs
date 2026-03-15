using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using ErrorOr;

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
    // Hardcoded Sepay config - move to configuration in production
    private const string SepayAccountNumber = "0378175727";
    private const string SepayBankCode = "MB";

    private readonly IPaymentTransactionRepository _transactionRepository;

    public PaymentService(IPaymentTransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public Task<ErrorOr<string>> GetQR(string note, long amount)
    {
        var url = $"https://qr.sepay.vn/img?acc={SepayAccountNumber}&bank={SepayBankCode}&amount={amount}&des={note}&template=TEMPLATE&download=false";
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
        return transaction;
    }

    public async Task<ErrorOr<PaymentTransactionEntity>> GetTransactionByCodeAsync(string transactionCode)
    {
        var transaction = await _transactionRepository.GetByTransactionCodeAsync(transactionCode);
        if (transaction == null)
        {
            return Error.NotFound("Transaction not found", $"No transaction found with code: {transactionCode}");
        }
        return transaction;
    }

    public async Task<ErrorOr<PaymentTransactionEntity>> ProcessPaymentCallbackAsync(SepayTransactionData transactionData)
    {
        var transactionCode = transactionData.TransactionContent?.Split(' ').FirstOrDefault();
        if (string.IsNullOrEmpty(transactionCode))
        {
            return Error.Failure("Invalid transaction content", "Could not extract transaction code from payment description");
        }

        var transaction = await _transactionRepository.GetByTransactionCodeAsync(transactionCode);
        if (transaction == null)
        {
            return Error.NotFound("Transaction not found", $"No transaction found matching: {transactionCode}");
        }

        if (transaction.Status != TransactionStatus.Pending)
        {
            return Error.Conflict("Transaction already processed", $"Transaction {transactionCode} has status: {transaction.Status}");
        }

        if (transaction.IsExpired())
        {
            transaction.MarkAsFailed("EXPIRED", "Transaction has expired");
            await _transactionRepository.UpdateAsync(transaction);
            return Error.Conflict("Transaction expired", "The payment window has expired");
        }

        transaction.MarkAsPaid(
            paidAmount: transactionData.Amount,
            paidAt: transactionData.TransactionDate,
            externalTransactionId: transactionData.TransactionId);

        transaction.SenderAccountNumber = transactionData.AccountNumber;
        transaction.BeneficiaryBank = transactionData.BankBrandName;

        await _transactionRepository.UpdateAsync(transaction);
        return transaction;
    }

    public async Task<ErrorOr<PaymentTransactionEntity>> ExpireTransactionAsync(string transactionCode)
    {
        var transaction = await _transactionRepository.GetByTransactionCodeAsync(transactionCode);
        if (transaction == null)
        {
            return Error.NotFound("Transaction not found", $"No transaction found with code: {transactionCode}");
        }

        if (transaction.Status != TransactionStatus.Pending)
        {
            return Error.Conflict("Cannot expire", $"Transaction is already in status: {transaction.Status}");
        }

        transaction.MarkAsFailed("EXPIRED", "Transaction expired - payment window closed");
        await _transactionRepository.UpdateAsync(transaction);

        return transaction;
    }
}
