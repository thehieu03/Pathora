using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class TourPlanRouteEntityTests
{
    [Fact]
    public void Create_ShouldSetAllProperties()
    {
        var entity = TourPlanRouteEntity.Create(
            1, TransportationType.Bus, "admin",
            "Airport Bus", "Express bus to hotel",
            new TimeOnly(8, 0), new TimeOnly(10, 0), 120, 50.5m, 150000m,
            "BK-12345", "Air-conditioned");

        Assert.NotEqual(Guid.Empty, entity.Id);
        Assert.Equal(1, entity.Order);
        Assert.Equal(TransportationType.Bus, entity.TransportationType);
        Assert.Equal("Airport Bus", entity.TransportationName);
        Assert.Equal(120, entity.DurationMinutes);
        Assert.Equal(50.5m, entity.DistanceKm);
        Assert.Equal(150000m, entity.Price);
        Assert.Equal("BK-12345", entity.BookingReference);
        Assert.Equal("admin", entity.CreatedBy);
    }

    [Fact]
    public void Create_WithMinimalParams_ShouldHaveNullOptionals()
    {
        var entity = TourPlanRouteEntity.Create(
            1, TransportationType.Walking, "admin");

        Assert.Null(entity.TransportationName);
        Assert.Null(entity.DurationMinutes);
        Assert.Null(entity.DistanceKm);
        Assert.Null(entity.Price);
        Assert.Null(entity.BookingReference);
    }

    [Fact]
    public void Update_ShouldModifyProperties()
    {
        var entity = TourPlanRouteEntity.Create(
            1, TransportationType.Walking, "admin");

        entity.Update(2, TransportationType.Boat, "editor",
            "Speed Boat", "Fast transfer", null, null, 45, 10m, 200000m);

        Assert.Equal(2, entity.Order);
        Assert.Equal(TransportationType.Boat, entity.TransportationType);
        Assert.Equal("Speed Boat", entity.TransportationName);
        Assert.Equal(45, entity.DurationMinutes);
        Assert.Equal("editor", entity.LastModifiedBy);
    }
}
