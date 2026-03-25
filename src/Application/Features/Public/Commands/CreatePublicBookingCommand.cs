using System.Globalization;
using ErrorOr;
using FluentValidation;
using Application.Common.Constant;
using Application.Contracts.Booking;
using BuildingBlocks.CORS;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using Domain.ValueObjects;

namespace Application.Features.Public.Commands;

public sealed record CreatePublicBookingCommand(
    Guid TourInstanceId,
    string CustomerName,
    string CustomerPhone,
    string? CustomerEmail,
    int NumberAdult,
    int NumberChild,
    int NumberInfant,
    PaymentMethod PaymentMethod,
    bool IsFullPay
) : ICommand<ErrorOr<CheckoutPriceResponse>>;

public sealed class CreatePublicBookingCommandValidator : AbstractValidator<CreatePublicBookingCommand>
{
    public CreatePublicBookingCommandValidator()
    {
        RuleFor(x => x.TourInstanceId)
            .NotEmpty().WithMessage("ID tour không được để trống.");

        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("Tên khách hàng không được để trống.")
            .MaximumLength(200).WithMessage("Tên khách hàng không được vượt quá 200 ký tự.");

        RuleFor(x => x.CustomerPhone)
            .NotEmpty().WithMessage("Số điện thoại không được để trống.")
            .Matches(@"^\+?[0-9\s\-]{8,20}$")
            .WithMessage("Số điện thoại không hợp lệ.");

        RuleFor(x => x.CustomerEmail)
            .EmailAddress().WithMessage("Email không hợp lệ.")
            .When(x => !string.IsNullOrWhiteSpace(x.CustomerEmail));

        RuleFor(x => x.NumberAdult)
            .GreaterThan(0).WithMessage("Số người lớn phải lớn hơn 0.");

        RuleFor(x => x.NumberChild)
            .GreaterThanOrEqualTo(0).WithMessage("Số trẻ em không được âm.");

        RuleFor(x => x.NumberInfant)
            .GreaterThanOrEqualTo(0).WithMessage("Số em bé không được âm.");

        RuleFor(x => x.PaymentMethod)
            .IsInEnum().WithMessage("Phương thức thanh toán không hợp lệ.");
    }
}

public sealed class CreatePublicBookingCommandHandler(
    IBookingRepository bookingRepository,
    ITourInstanceRepository tourInstanceRepository,
    IPricingPolicyRepository pricingPolicyRepository,
    IUnitOfWork unitOfWork)
    : ICommandHandler<CreatePublicBookingCommand, ErrorOr<CheckoutPriceResponse>>
{
    public async Task<ErrorOr<CheckoutPriceResponse>> Handle(
        CreatePublicBookingCommand request,
        CancellationToken cancellationToken)
    {
        // Verify tour instance exists and is available
        var tourInstance = await tourInstanceRepository.FindById(request.TourInstanceId);
        if (tourInstance == null)
        {
            return Error.NotFound(
                ErrorConstants.TourInstance.NotFoundCode,
                ErrorConstants.TourInstance.NotFoundDescription);
        }

        if (tourInstance.Status != TourInstanceStatus.Available)
        {
            return Error.Conflict(
                "TourInstance.NotAvailable",
                "Tour hiện không có sẵn để đặt.");
        }

        // Check capacity
        var currentBookings = await bookingRepository.CountByTourInstanceIdAsync(request.TourInstanceId);
        var totalParticipants = request.NumberAdult + request.NumberChild + request.NumberInfant;

        if (currentBookings + totalParticipants > tourInstance.MaxParticipation)
        {
            return Error.Conflict(
                "TourInstance.NotEnoughCapacity",
                "Tour không còn đủ chỗ cho số lượng người yêu cầu.");
        }

        // Calculate total price
        var adultPrice = tourInstance.BasePrice;
        var childPrice = tourInstance.BasePrice;
        var infantPrice = tourInstance.BasePrice;

        var adultSubtotal = adultUnitPrice * request.NumberAdult;
        var childSubtotal = childUnitPrice * request.NumberChild;
        var infantSubtotal = infantUnitPrice * request.NumberInfant;
        var subtotal = adultSubtotal + childSubtotal + infantSubtotal;

        // Get tax config (simplified - using 0 for now)
        var taxRate = 0m;
        var taxAmount = subtotal * taxRate / 100;
        var totalPrice = subtotal + taxAmount;

        // Create booking entity
        var booking = BookingEntity.Create(
            tourInstanceId: request.TourInstanceId,
            customerName: request.CustomerName,
            customerPhone: request.CustomerPhone,
            numberAdult: request.NumberAdult,
            totalPrice: totalPrice,
            paymentMethod: request.PaymentMethod,
            isFullPay: request.IsFullPay,
            performedBy: "PUBLIC_USER",
            customerEmail: request.CustomerEmail,
            numberChild: request.NumberChild,
            numberInfant: request.NumberInfant);

        await bookingRepository.AddAsync(booking);
        await unitOfWork.SaveChangeAsync(cancellationToken);

        // Build checkout price response
        var depositPercentage = request.IsFullPay ? 0m : 30m;
        var depositAmount = totalPrice * depositPercentage / 100;
        var remainingBalance = totalPrice - depositAmount;

        return new CheckoutPriceResponse(
            BookingId: booking.Id,
            TourInstanceId: tourInstance.Id,
            TourName: tourInstance.TourName,
            TourCode: tourInstance.TourCode,
            ThumbnailUrl: tourInstance.Thumbnail?.PublicURL,
            StartDate: tourInstance.StartDate,
            EndDate: tourInstance.EndDate,
            DurationDays: tourInstance.DurationDays,
            Location: tourInstance.Location,
            NumberAdult: request.NumberAdult,
            NumberChild: request.NumberChild,
            NumberInfant: request.NumberInfant,
            BasePrice: basePrice,
            ChildPrice: childUnitPrice,
            InfantPrice: infantUnitPrice,
            AdultSubtotal: adultSubtotal,
            ChildSubtotal: childSubtotal,
            InfantSubtotal: infantSubtotal,
            Subtotal: subtotal,
            TaxRate: taxRate,
            TaxAmount: taxAmount,
            TotalPrice: totalPrice,
            DepositPercentage: depositPercentage,
            DepositAmount: depositAmount,
            RemainingBalance: remainingBalance);
    }

    private static decimal ApplyPricingTier(decimal basePrice, List<PricingPolicyTier> tiers, int age)
    {
        foreach (var tier in tiers)
        {
            if (age >= tier.AgeFrom && (!tier.AgeTo.HasValue || age <= tier.AgeTo.Value))
            {
                return basePrice * tier.PricePercentage / 100m;
            }
        }
        return basePrice;
    }
}
