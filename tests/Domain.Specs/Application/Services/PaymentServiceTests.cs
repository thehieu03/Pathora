using Application.Common.Constant;
using Application.Services;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using ErrorOr;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;

namespace Domain.Specs.Application.Services;

public sealed class PaymentServiceTests
{
    private readonly IPaymentTransactionRepository _transactionRepo = Substitute.For<IPaymentTransactionRepository>();
    private readonly IBookingRepository _bookingRepo = Substitute.For<IBookingRepository>();
    private readonly IOutboxRepository _outboxRepo = Substitute.For<IOutboxRepository>();
    private readonly IPayOSClient _payOSClient = Substitute.For<IPayOSClient>();
    private readonly ILogger<PaymentService> _logger = Substitute.For<ILogger<PaymentService>>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly IConfiguration _configuration = Substitute.For<IConfiguration>();

    private PaymentService CreateService() => new(
        _transactionRepo,
        _bookingRepo,
        _outboxRepo,
        _payOSClient,
        _logger,
        _configuration,
        _unitOfWork);

    private static PaymentTransactionEntity CreatePendingTransaction(
        Guid bookingId,
        TransactionType type = TransactionType.Deposit,
        decimal amount = 100000m)
    {
        var transaction = PaymentTransactionEntity.Create(
            bookingId: bookingId,
            transactionCode: "PAY-20240101-ABCD1234",
            type: type,
            amount: amount,
            paymentMethod: PaymentMethod.BankTransfer,
            paymentNote: "Test payment",
            createdBy: "test@test.com",
            expiredAt: DateTimeOffset.UtcNow.AddHours(1));
        return transaction;
    }

    private static BookingEntity CreatePendingBooking(Guid id) =>
        BookingEntity.Create(
            tourInstanceId: Guid.NewGuid(),
            customerName: "Test User",
            customerPhone: "0123456789",
            numberAdult: 2,
            totalPrice: 100000m,
            paymentMethod: PaymentMethod.BankTransfer,
            isFullPay: false,
            performedBy: "test@test.com");

    #region TC01: ProcessPaymentCallbackAsync with Deposit persists booking to database

    [Fact]
    public async Task ProcessPaymentCallbackAsync_WhenBookingPending_ShouldPersistToDatabase()
    {
        // Arrange
        var bookingId = Guid.NewGuid();
        var transaction = CreatePendingTransaction(bookingId);
        var booking = CreatePendingBooking(bookingId);

        _transactionRepo.GetByTransactionCodeAsync(Arg.Any<string>()).Returns(transaction);
        _transactionRepo.UpdateAsync(Arg.Any<PaymentTransactionEntity>()).Returns(Task.CompletedTask);
        _bookingRepo.GetByIdAsync(bookingId).Returns(booking);
        _bookingRepo.UpdateAsync(Arg.Any<BookingEntity>()).Returns(Task.CompletedTask);

        var transactionData = new SepayTransactionData
        {
            TransactionId = "tx-001",
            TransactionContent = "PAY-20240101-ABCD1234",
            Amount = 100000m,
            TransactionDate = DateTimeOffset.UtcNow
        };

        var service = CreateService();

        // Act
        var result = await service.ProcessSepayCallbackAsync(transactionData);

        // Assert
        Assert.False(result.IsError);
        await _bookingRepo.ReceivedWithAnyArgs().UpdateAsync(Arg.Any<BookingEntity>());
    }

    #endregion

    #region TC02: ProcessPaymentCallbackAsync with FullPayment persists booking to Paid

    [Fact]
    public async Task ProcessPaymentCallbackAsync_WhenBookingConfirmed_ShouldTransitionToPaid()
    {
        // Arrange
        var bookingId = Guid.NewGuid();
        var transaction = CreatePendingTransaction(bookingId, TransactionType.FullPayment, 500000m);
        var booking = CreatePendingBooking(bookingId);

        _transactionRepo.GetByTransactionCodeAsync(Arg.Any<string>()).Returns(transaction);
        _transactionRepo.UpdateAsync(Arg.Any<PaymentTransactionEntity>()).Returns(Task.CompletedTask);
        _bookingRepo.GetByIdAsync(Arg.Any<Guid>()).Returns(booking);
        _bookingRepo.UpdateAsync(Arg.Any<BookingEntity>()).Returns(Task.CompletedTask);

        var transactionData = new SepayTransactionData
        {
            TransactionId = "tx-002",
            TransactionContent = "PAY-20240101-ABCD1234",
            Amount = 500000m,
            TransactionDate = DateTimeOffset.UtcNow
        };

        var service = CreateService();

        // Act
        var result = await service.ProcessSepayCallbackAsync(transactionData);

        // Assert
        Assert.False(result.IsError);
        await _bookingRepo.ReceivedWithAnyArgs().UpdateAsync(Arg.Any<BookingEntity>());
    }

    #endregion

    #region TC03: ProcessPaymentCallbackAsync when booking update fails does not fail payment

    [Fact]
    public async Task ProcessPaymentCallbackAsync_WhenUpdateFails_ShouldNotFailPayment()
    {
        // Arrange
        var bookingId = Guid.NewGuid();
        var transaction = CreatePendingTransaction(bookingId);
        var booking = CreatePendingBooking(bookingId);

        _transactionRepo.GetByTransactionCodeAsync(Arg.Any<string>()).Returns(transaction);
        _transactionRepo.UpdateAsync(Arg.Any<PaymentTransactionEntity>()).Returns(Task.CompletedTask);
        _bookingRepo.GetByIdAsync(bookingId).Returns(booking);
        _bookingRepo.UpdateAsync(Arg.Any<BookingEntity>()).Returns(Task.FromException(new InvalidOperationException("Database error")));

        var transactionData = new SepayTransactionData
        {
            TransactionId = "tx-003",
            TransactionContent = "PAY-20240101-ABCD1234",
            Amount = 100000m,
            TransactionDate = DateTimeOffset.UtcNow
        };

        var service = CreateService();

        // Act
        var result = await service.ProcessSepayCallbackAsync(transactionData);

        // Assert — payment should still succeed despite booking update failure
        Assert.False(result.IsError);
        _logger.ReceivedWithAnyArgs().Log(
            LogLevel.Error,
            Arg.Any<EventId>(),
            Arg.Any<object>(),
            Arg.Any<Exception>(),
            Arg.Any<Func<object, Exception?, string>>());
    }

    #endregion
}
