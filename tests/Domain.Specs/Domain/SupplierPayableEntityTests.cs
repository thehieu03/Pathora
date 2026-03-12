using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class SupplierPayableEntityTests
{
    [Fact]
    public void Create_ShouldInitializeUnpaidStatus()
    {
        var entity = SupplierPayableEntity.Create(
            Guid.CreateVersion7(),
            Guid.CreateVersion7(),
            1000,
            "tester");

        Assert.Equal(1000, entity.ExpectedAmount);
        Assert.Equal(0, entity.PaidAmount);
        Assert.Equal(PaymentStatus.Unpaid, entity.Status);
    }

    [Fact]
    public void RecordPayment_WhenPaidPartially_ShouldSetPartialStatus()
    {
        var entity = SupplierPayableEntity.Create(
            Guid.CreateVersion7(),
            Guid.CreateVersion7(),
            1000,
            "tester");

        entity.RecordPayment(200, "tester");

        Assert.Equal(200, entity.PaidAmount);
        Assert.Equal(PaymentStatus.Partial, entity.Status);
    }

    [Fact]
    public void RecordPayment_WhenPaidEnough_ShouldSetSettledStatus()
    {
        var entity = SupplierPayableEntity.Create(
            Guid.CreateVersion7(),
            Guid.CreateVersion7(),
            1000,
            "tester");

        entity.RecordPayment(1000, "tester");

        Assert.Equal(PaymentStatus.Settled, entity.Status);
    }

    [Fact]
    public void Update_WhenPaidExceedsExpected_ShouldSetOverpaidStatus()
    {
        var entity = SupplierPayableEntity.Create(
            Guid.CreateVersion7(),
            Guid.CreateVersion7(),
            1000,
            "tester");

        entity.Update(1000, "tester", paidAmount: 1200);

        Assert.Equal(1200, entity.PaidAmount);
        Assert.Equal(PaymentStatus.Overpaid, entity.Status);
    }
}
