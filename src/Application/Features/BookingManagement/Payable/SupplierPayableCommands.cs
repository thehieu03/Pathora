using Application.Contracts.Booking;
using BuildingBlocks.CORS;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using ErrorOr;
using FluentValidation;

namespace Application.Features.BookingManagement.Payable;

public sealed record CreateSupplierPayableCommand(
    Guid BookingId,
    Guid SupplierId,
    decimal ExpectedAmount,
    DateTimeOffset? DueAt,
    string? Note) : ICommand<ErrorOr<Guid>>;

public sealed class CreateSupplierPayableCommandValidator : AbstractValidator<CreateSupplierPayableCommand>
{
    public CreateSupplierPayableCommandValidator()
    {
        RuleFor(x => x.BookingId).NotEmpty();
        RuleFor(x => x.SupplierId).NotEmpty();
        RuleFor(x => x.ExpectedAmount).GreaterThanOrEqualTo(0);
    }
}

public sealed class CreateSupplierPayableCommandHandler(
    IBookingRepository bookingRepository,
    ISupplierRepository supplierRepository,
    ISupplierPayableRepository supplierPayableRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<CreateSupplierPayableCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateSupplierPayableCommand request, CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetByIdAsync(request.BookingId);
        if (booking is null)
        {
            return Error.NotFound("Booking.NotFound", "Không tìm thấy booking.");
        }

        var supplier = await supplierRepository.GetByIdAsync(request.SupplierId);
        if (supplier is null)
        {
            return Error.NotFound("Supplier.NotFound", "Không tìm thấy nhà cung cấp.");
        }

        var entity = SupplierPayableEntity.Create(
            request.BookingId,
            request.SupplierId,
            request.ExpectedAmount,
            performedBy: "system",
            request.DueAt,
            request.Note);

        await supplierPayableRepository.AddAsync(entity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return entity.Id;
    }
}

public sealed record UpdateSupplierPayableCommand(
    Guid SupplierPayableId,
    decimal ExpectedAmount,
    decimal PaidAmount,
    DateTimeOffset? DueAt,
    string? Note) : ICommand<ErrorOr<Success>>;

public sealed class SupplierPayableValidator : AbstractValidator<UpdateSupplierPayableCommand>
{
    public SupplierPayableValidator()
    {
        RuleFor(x => x.SupplierPayableId).NotEmpty();
        RuleFor(x => x.ExpectedAmount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.PaidAmount).GreaterThanOrEqualTo(0);
        RuleFor(x => x)
            .Must(x => x.PaidAmount <= x.ExpectedAmount)
            .WithMessage("Số tiền đã thanh toán không được lớn hơn số tiền dự kiến.");
    }
}

public sealed class UpdateSupplierPayableCommandHandler(
    ISupplierPayableRepository supplierPayableRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<UpdateSupplierPayableCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateSupplierPayableCommand request, CancellationToken cancellationToken)
    {
        var entity = await supplierPayableRepository.GetByIdAsync(request.SupplierPayableId);
        if (entity is null)
        {
            return Error.NotFound("SupplierPayable.NotFound", "Không tìm thấy payable.");
        }

        entity.Update(
            request.ExpectedAmount,
            performedBy: "system",
            request.DueAt,
            request.Note,
            request.PaidAmount);

        supplierPayableRepository.Update(entity);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return Result.Success;
    }
}

public sealed record RecordSupplierPaymentCommand(
    Guid SupplierPayableId,
    decimal Amount,
    DateTimeOffset PaidAt,
    PaymentMethod PaymentMethod,
    string? TransactionRef,
    string? Note) : ICommand<ErrorOr<Guid>>;

public sealed class RecordSupplierPaymentCommandValidator : AbstractValidator<RecordSupplierPaymentCommand>
{
    public RecordSupplierPaymentCommandValidator()
    {
        RuleFor(x => x.SupplierPayableId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
    }
}

public sealed class RecordSupplierPaymentCommandHandler(
    ISupplierPayableRepository supplierPayableRepository,
    ISupplierReceiptRepository supplierReceiptRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<RecordSupplierPaymentCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(RecordSupplierPaymentCommand request, CancellationToken cancellationToken)
    {
        var payable = await supplierPayableRepository.GetByIdAsync(request.SupplierPayableId);
        if (payable is null)
        {
            return Error.NotFound("SupplierPayable.NotFound", "Không tìm thấy payable.");
        }

        var receipt = SupplierReceiptEntity.Create(
            request.SupplierPayableId,
            request.Amount,
            request.PaidAt,
            request.PaymentMethod,
            performedBy: "system",
            request.TransactionRef,
            request.Note);

        payable.RecordPayment(request.Amount, "system");

        await supplierReceiptRepository.AddAsync(receipt);
        supplierPayableRepository.Update(payable);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        return receipt.Id;
    }
}

public sealed record GetSupplierPayablesQuery(Guid BookingId) : IQuery<ErrorOr<List<SupplierPayableDto>>>;

public sealed class GetSupplierPayablesQueryHandler(
    ISupplierPayableRepository supplierPayableRepository,
    ISupplierReceiptRepository supplierReceiptRepository)
    : IQueryHandler<GetSupplierPayablesQuery, ErrorOr<List<SupplierPayableDto>>>
{
    public async Task<ErrorOr<List<SupplierPayableDto>>> Handle(GetSupplierPayablesQuery request, CancellationToken cancellationToken)
    {
        var payables = await supplierPayableRepository.GetByBookingIdAsync(request.BookingId);
        var result = new List<SupplierPayableDto>();

        foreach (var payable in payables)
        {
            var receipts = await supplierReceiptRepository.GetBySupplierPayableIdAsync(payable.Id);
            result.Add(new SupplierPayableDto(
                payable.Id,
                payable.BookingId,
                payable.SupplierId,
                payable.ExpectedAmount,
                payable.PaidAmount,
                payable.DueAt,
                payable.Status,
                payable.Note,
                receipts.Select(r => new SupplierReceiptDto(
                    r.Id,
                    r.SupplierPayableId,
                    r.Amount,
                    r.PaidAt,
                    r.PaymentMethod,
                    r.TransactionRef,
                    r.Note)).ToList()));
        }

        return result;
    }
}
