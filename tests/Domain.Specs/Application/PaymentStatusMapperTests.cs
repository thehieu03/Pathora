using Application.Services;
using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Application;

public sealed class PaymentStatusMapperTests
{
    [Fact]
    public void FromTransaction_WhenCompleted_ShouldReturnPaid()
    {
        var transaction = CreatePendingTransaction();
        transaction.MarkAsPaid(100_000m, DateTimeOffset.UtcNow, "provider-1");

        var normalizedStatus = PaymentStatusMapper.FromTransaction(transaction);

        Assert.Equal(PaymentStatusMapper.Paid, normalizedStatus);
    }

    [Fact]
    public void FromTransaction_WhenFailedWithExpiredCode_ShouldReturnExpired()
    {
        var transaction = CreatePendingTransaction();
        transaction.MarkAsFailed("EXPIRED", "expired");

        var normalizedStatus = PaymentStatusMapper.FromTransaction(transaction);

        Assert.Equal(PaymentStatusMapper.Expired, normalizedStatus);
    }

    [Fact]
    public void FromProviderStatus_WhenCancelled_ShouldReturnCancelled()
    {
        var normalizedStatus = PaymentStatusMapper.FromProviderStatus("cancelled");

        Assert.Equal(PaymentStatusMapper.Cancelled, normalizedStatus);
    }

    [Theory]
    [InlineData(PaymentStatusMapper.Pending, false)]
    [InlineData(PaymentStatusMapper.Paid, true)]
    [InlineData(PaymentStatusMapper.Cancelled, true)]
    [InlineData(PaymentStatusMapper.Expired, true)]
    [InlineData(PaymentStatusMapper.Failed, true)]
    public void IsTerminal_ShouldMatchExpectedTerminalState(string status, bool expected)
    {
        var isTerminal = PaymentStatusMapper.IsTerminal(status);

        Assert.Equal(expected, isTerminal);
    }

    private static PaymentTransactionEntity CreatePendingTransaction()
    {
        return PaymentTransactionEntity.Create(
            bookingId: Guid.CreateVersion7(),
            transactionCode: "PAY-TEST-0001",
            type: TransactionType.Deposit,
            amount: 100_000m,
            paymentMethod: PaymentMethod.BankTransfer,
            paymentNote: "PAY-TEST-0001",
            createdBy: "tester");
    }
}
