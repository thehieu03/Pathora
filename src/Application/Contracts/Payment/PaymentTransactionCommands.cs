using Application.Common.Constant;
using Application.Services;
using BuildingBlocks.CORS;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using ErrorOr;
using FluentValidation;
using MediatR;

namespace Application.Contracts.Payment;

public sealed record CreatePaymentTransactionCommand(
    Guid BookingId,
    TransactionType Type,
    decimal Amount,
    PaymentMethod PaymentMethod,
    string PaymentNote,
    string CreatedBy,
    int ExpirationMinutes = 30
) : IRequest<ErrorOr<PaymentTransactionEntity>>;

public class CreatePaymentTransactionCommandValidator : AbstractValidator<CreatePaymentTransactionCommand>
{
    public CreatePaymentTransactionCommandValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("Booking ID không được để trống.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Số tiền phải lớn hơn 0.");

        RuleFor(x => x.PaymentNote)
            .NotEmpty().WithMessage("Nội dung thanh toán không được để trống.")
            .MaximumLength(500).WithMessage("Nội dung thanh toán không được vượt quá 500 ký tự.");

        RuleFor(x => x.CreatedBy)
            .NotEmpty().WithMessage("Người tạo không được để trống.");
    }
}

public sealed class CreatePaymentTransactionCommandHandler(
    IPaymentService paymentService,
    IBookingRepository bookingRepository)
    : IRequestHandler<CreatePaymentTransactionCommand, ErrorOr<PaymentTransactionEntity>>
{
    public async Task<ErrorOr<PaymentTransactionEntity>> Handle(
        CreatePaymentTransactionCommand request,
        CancellationToken cancellationToken)
    {
        // Verify booking exists
        var booking = await bookingRepository.GetByIdAsync(request.BookingId);
        if (booking == null)
        {
            return Error.NotFound(ErrorConstants.Payment.BookingNotFoundCode, ErrorConstants.Payment.BookingNotFoundDescription);
        }

        // Verify booking can accept payments
        if (booking.Status == BookingStatus.Cancelled)
        {
            return Error.Conflict(ErrorConstants.Payment.TransactionAlreadyCancelledCode, ErrorConstants.Payment.TransactionAlreadyCancelledDescription);
        }

        if (booking.Status == BookingStatus.Completed)
        {
            return Error.Conflict(ErrorConstants.Payment.TransactionAlreadyCompletedCode, ErrorConstants.Payment.TransactionAlreadyCompletedDescription);
        }

        return await paymentService.CreatePaymentTransactionAsync(
            bookingId: request.BookingId,
            type: request.Type,
            amount: request.Amount,
            paymentMethod: request.PaymentMethod,
            paymentNote: request.PaymentNote,
            createdBy: request.CreatedBy,
            expirationMinutes: request.ExpirationMinutes);
    }
}

public sealed record GetPaymentTransactionQuery(string TransactionCode) : IRequest<ErrorOr<PaymentTransactionEntity>>;

public sealed class GetPaymentTransactionQueryHandler(IPaymentService paymentService)
    : IRequestHandler<GetPaymentTransactionQuery, ErrorOr<PaymentTransactionEntity>>
{
    public async Task<ErrorOr<PaymentTransactionEntity>> Handle(
        GetPaymentTransactionQuery request,
        CancellationToken cancellationToken)
    {
        return await paymentService.GetTransactionByCodeAsync(request.TransactionCode);
    }
}

public sealed record ExpirePaymentTransactionCommand(string TransactionCode) : IRequest<ErrorOr<PaymentTransactionEntity>>;

public class ExpirePaymentTransactionCommandValidator : AbstractValidator<ExpirePaymentTransactionCommand>
{
    public ExpirePaymentTransactionCommandValidator()
    {
        RuleFor(x => x.TransactionCode)
            .NotEmpty().WithMessage("Mã giao dịch không được để trống.");
    }
}

public sealed class ExpirePaymentTransactionCommandHandler(IPaymentService paymentService)
    : IRequestHandler<ExpirePaymentTransactionCommand, ErrorOr<PaymentTransactionEntity>>
{
    public async Task<ErrorOr<PaymentTransactionEntity>> Handle(
        ExpirePaymentTransactionCommand request,
        CancellationToken cancellationToken)
    {
        return await paymentService.ExpireTransactionAsync(request.TransactionCode);
    }
}
