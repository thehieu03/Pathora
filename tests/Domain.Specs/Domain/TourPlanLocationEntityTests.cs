using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class TourPlanLocationEntityTests
{
    [Fact]
    public void Create_ShouldSetAllProperties()
    {
        var entity = TourPlanLocationEntity.Create(
            "Vịnh Hạ Long", LocationType.TouristAttraction, "admin",
            "UNESCO World Heritage", "Quảng Ninh", "Hạ Long", "Việt Nam",
            20.9101m, 107.1839m, 250000m,
            new TimeOnly(6, 0), new TimeOnly(18, 0), 120, "Mang theo áo phao");

        Assert.NotEqual(Guid.Empty, entity.Id);
        Assert.Equal("Vịnh Hạ Long", entity.LocationName);
        Assert.Equal(LocationType.TouristAttraction, entity.LocationType);
        Assert.Equal("Quảng Ninh", entity.Address);
        Assert.Equal("Hạ Long", entity.City);
        Assert.Equal("Việt Nam", entity.Country);
        Assert.Equal(20.9101m, entity.Latitude);
        Assert.Equal(107.1839m, entity.Longitude);
        Assert.Equal(250000m, entity.EntranceFee);
        Assert.Equal(120, entity.EstimatedDurationMinutes);
        Assert.Equal("admin", entity.CreatedBy);
    }

    [Fact]
    public void Create_WithMinimalParams_ShouldHaveNullOptionals()
    {
        var entity = TourPlanLocationEntity.Create(
            "Beach", LocationType.Beach, "admin");

        Assert.Null(entity.Address);
        Assert.Null(entity.City);
        Assert.Null(entity.Country);
        Assert.Null(entity.Latitude);
        Assert.Null(entity.Longitude);
        Assert.Null(entity.EntranceFee);
    }

    [Fact]
    public void Update_ShouldModifyProperties()
    {
        var entity = TourPlanLocationEntity.Create(
            "Original", LocationType.TouristAttraction, "admin");

        entity.Update("Updated", LocationType.Beach, "editor",
            "New desc", "123 Street", "Đà Nẵng", "Việt Nam",
            16.0544m, 108.2022m, 0m);

        Assert.Equal("Updated", entity.LocationName);
        Assert.Equal(LocationType.Beach, entity.LocationType);
        Assert.Equal("Đà Nẵng", entity.City);
        Assert.Equal("editor", entity.LastModifiedBy);
    }
}
