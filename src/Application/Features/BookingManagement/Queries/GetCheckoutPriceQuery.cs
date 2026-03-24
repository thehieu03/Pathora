using Application.Contracts.Booking;
using Application.Services;
using BuildingBlocks.CORS;
using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;

namespace Application.Features.BookingManagement.Queries;

public sealed record GetCheckoutPriceQuery(Guid BookingId) : IQuery<ErrorOr<CheckoutPriceResponse>>;

public sealed class GetCheckoutPriceQueryHandler(
    IBookingRepository bookingRepository,
    ITaxConfigRepository taxConfigRepository,
    IPricingPolicyRepository pricingPolicyRepository)
    : IQueryHandler<GetCheckoutPriceQuery, ErrorOr<CheckoutPriceResponse>>
{
    public async Task<ErrorOr<CheckoutPriceResponse>> Handle(GetCheckoutPriceQuery request, CancellationToken cancellationToken)
    {
        var booking = await bookingRepository.GetByIdAsync(request.BookingId);
        if (booking == null)
            return Error.NotFound("Booking not found");

        var tourInstance = booking.TourInstance;
        if (tourInstance == null)
            return Error.Failure("Tour instance not found");

        var taxConfigs = await taxConfigRepository.GetListAsync(t => t.IsActive);
        var activeTaxConfig = taxConfigs.FirstOrDefault();

        var pricingPolicy = await pricingPolicyRepository.GetActivePolicyByTourType(tourInstance.InstanceType)
            ?? await pricingPolicyRepository.GetDefaultPolicy();

        var basePrice = tourInstance.BasePrice;

        decimal adultPrice = basePrice;
        decimal childPrice = basePrice;
        decimal infantPrice = basePrice;

        if (pricingPolicy != null)
        {
            adultPrice = ApplyPricingTier(basePrice, pricingPolicy.Tiers, 18);
            childPrice = ApplyPricingTier(basePrice, pricingPolicy.Tiers, 5);
            infantPrice = ApplyPricingTier(basePrice, pricingPolicy.Tiers, 1);
        }

        var adultSubtotal = adultPrice * booking.NumberAdult;
        var childSubtotal = childPrice * booking.NumberChild;
        var infantSubtotal = infantPrice * booking.NumberInfant;
        var subtotal = adultSubtotal + childSubtotal + infantSubtotal;

        var taxRate = activeTaxConfig?.TaxRate ?? 0;
        var taxAmount = subtotal * taxRate / 100;
        var totalPrice = subtotal + taxAmount;

        var depositPercentage = 30m;
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
            NumberAdult: booking.NumberAdult,
            NumberChild: booking.NumberChild,
            NumberInfant: booking.NumberInfant,
            BasePrice: basePrice,
            ChildPrice: booking.NumberChild > 0 ? childPrice : null,
            InfantPrice: booking.NumberInfant > 0 ? infantPrice : null,
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

    private static decimal ApplyPricingTier(decimal basePrice, List<Domain.ValueObjects.PricingPolicyTier> tiers, int age)
    {
        foreach (var tier in tiers)
        {
            if (age >= tier.AgeFrom && (!tier.AgeTo.HasValue || age <= tier.AgeTo.Value))
            {
                return basePrice * tier.PricePercentage / 100;
            }
        }
        return basePrice;
    }
}
