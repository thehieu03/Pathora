using Application.Services;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using ErrorOr;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;

namespace Domain.Specs.Application;

public sealed class PaymentReconciliationServiceTests
{
    private readonly IPaymentTransactionRepository _transactionRepository = Substitute.For<IPaymentTransactionRepository>();
    private readonly IPaymentService _paymentService = Substitute.For<IPaymentService>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly ILogger<PaymentReconciliationService> _logger = Substitute.For<ILogger<PaymentReconciliationService>>();

    [Fact]
    public async Task GetNormalizedStatusAsync_WhenTransactionCompleted_ShouldReturnPaid()
    {
        var transaction = CreatePendingTransaction("PAY-TEST-1001");
        transaction.MarkAsPaid(100_000m, DateTimeOffset.UtcNow, "provider-1");
        _transactionRepository.GetByTransactionCodeAsync(transaction.TransactionCode).Returns(transaction);

        var sut = CreateSut();
        var result = await sut.GetNormalizedStatusAsync(transaction.TransactionCode);

        Assert.False(result.IsError);
        Assert.Equal(PaymentStatusMapper.Paid, result.Value.NormalizedStatus);
        Assert.Equal("Completed", result.Value.RawStatus);
    }

    [Fact]
    public async Task ReconcileReturnAsync_WhenProviderNotConfiguredAndPending_ShouldKeepPending()
    {
        var transaction = CreatePendingTransaction("PAY-TEST-1002");
        _transactionRepository.GetByTransactionCodeAsync(transaction.TransactionCode).Returns(transaction);

        var sut = CreateSut();
        var result = await sut.ReconcileReturnAsync(transaction.TransactionCode);

        Assert.False(result.IsError);
        Assert.Equal(PaymentStatusMapper.Pending, result.Value.NormalizedStatus);
        Assert.False(result.Value.VerifiedWithProvider);
    }

    [Fact]
    public async Task ReconcileCancelAsync_WhenTransactionPending_ShouldMarkCancelled()
    {
        var transaction = CreatePendingTransaction("PAY-TEST-1003");
        _transactionRepository.GetByTransactionCodeAsync(transaction.TransactionCode).Returns(transaction);

        var sut = CreateSut();
        var result = await sut.ReconcileCancelAsync(transaction.TransactionCode);

        Assert.False(result.IsError);
        Assert.Equal(PaymentStatusMapper.Cancelled, result.Value.NormalizedStatus);
        await _transactionRepository.Received(1).UpdateAsync(Arg.Is<PaymentTransactionEntity>(x => x.Status == TransactionStatus.Cancelled));
        await _unitOfWork.Received(1).SaveChangeAsync();
    }

    [Fact]
    public async Task ReconcileProviderCallbackAsync_WhenDuplicateEvent_ShouldReturnExistingSnapshot()
    {
        const string transactionCode = "PAY-TEST-1004";
        var completedTransaction = CreatePendingTransaction(transactionCode);
        completedTransaction.MarkAsPaid(100_000m, DateTimeOffset.UtcNow, "provider-duplicate");

        _transactionRepository.GetByTransactionCodeAsync(transactionCode).Returns(completedTransaction);
        _paymentService.ProcessPaymentCallbackAsync(Arg.Any<SepayTransactionData>())
            .Returns(Error.Conflict("Payment.Transaction.AlreadyCompleted", "already completed"));

        var sut = CreateSut();
        var result = await sut.ReconcileProviderCallbackAsync(new SepayTransactionData
        {
            TransactionId = "provider-duplicate",
            Amount = 100_000m,
            TransactionContent = $"{transactionCode} booking",
            TransactionDate = DateTimeOffset.UtcNow
        });

        Assert.False(result.IsError);
        Assert.Equal(PaymentStatusMapper.Paid, result.Value.NormalizedStatus);
        Assert.Equal(transactionCode, result.Value.TransactionCode);
    }

    private PaymentReconciliationService CreateSut(Dictionary<string, string?>? configValues = null)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues ?? new Dictionary<string, string?>())
            .Build();

        return new PaymentReconciliationService(
            _transactionRepository,
            _paymentService,
            _unitOfWork,
            configuration,
            _logger);
    }

    private static PaymentTransactionEntity CreatePendingTransaction(string transactionCode)
    {
        return PaymentTransactionEntity.Create(
            bookingId: Guid.CreateVersion7(),
            transactionCode: transactionCode,
            type: TransactionType.Deposit,
            amount: 100_000m,
            paymentMethod: PaymentMethod.BankTransfer,
            paymentNote: transactionCode,
            createdBy: "tester");
    }
}
