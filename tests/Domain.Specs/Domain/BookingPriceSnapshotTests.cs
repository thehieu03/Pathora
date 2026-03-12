using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class BookingPriceSnapshotTests
{
    [Fact]
    public void BookingTotalPrice_WhenTierPriceChangesLater_ShouldKeepOriginalSnapshot()
    {
        var instanceId = Guid.CreateVersion7();
        var tier = DynamicPricingTierEntity.CreateForTourInstance(instanceId, 4, 8, 2400000m, "tester");

        var resolvedPriceAtBookingTime = tier.PricePerPerson;
        var booking = BookingEntity.Create(
            tourInstanceId: instanceId,
            customerName: "Customer",
            customerPhone: "0123456789",
            numberAdult: 2,
            totalPrice: resolvedPriceAtBookingTime * 2,
            paymentMethod: PaymentMethod.Cash,
            isFullPay: true,
            performedBy: "tester");

        tier.PricePerPerson = 1800000m;

        Assert.Equal(4800000m, booking.TotalPrice);
    }
}
