using Application.Features.BookingManagement.Payable;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class SupplierPayableCommandHandlerTests
{
    [Fact]
    public async Task RecordSupplierPayment_WhenPayableNotFound_ShouldReturnNotFound()
    {
        var payableRepository = Substitute.For<ISupplierPayableRepository>();
        var receiptRepository = Substitute.For<ISupplierReceiptRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();

        payableRepository.GetByIdAsync(Arg.Any<Guid>()).Returns((SupplierPayableEntity?)null);

        var handler = new RecordSupplierPaymentCommandHandler(payableRepository, receiptRepository, unitOfWork);
        var command = new RecordSupplierPaymentCommand(
            Guid.CreateVersion7(),
            100,
            DateTimeOffset.UtcNow,
            PaymentMethod.BankTransfer,
            "TXN-1",
            null);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("SupplierPayable.NotFound", result.FirstError.Code);
    }

    [Fact]
    public async Task RecordSupplierPayment_WhenValid_ShouldCreateReceiptAndPersist()
    {
        var payableRepository = Substitute.For<ISupplierPayableRepository>();
        var receiptRepository = Substitute.For<ISupplierReceiptRepository>();
        var unitOfWork = Substitute.For<IUnitOfWork>();

        var payable = SupplierPayableEntity.Create(
            Guid.CreateVersion7(),
            Guid.CreateVersion7(),
            500,
            "tester");

        payableRepository.GetByIdAsync(payable.Id).Returns(payable);

        var handler = new RecordSupplierPaymentCommandHandler(payableRepository, receiptRepository, unitOfWork);
        var command = new RecordSupplierPaymentCommand(
            payable.Id,
            300,
            DateTimeOffset.UtcNow,
            PaymentMethod.BankTransfer,
            "TXN-2",
            "Paid first installment");

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.False(result.IsError);
        await receiptRepository.Received(1).AddAsync(Arg.Any<SupplierReceiptEntity>());
        payableRepository.Received(1).Update(payable);
        await unitOfWork.Received(1).SaveChangeAsync(Arg.Any<CancellationToken>());
    }
}
