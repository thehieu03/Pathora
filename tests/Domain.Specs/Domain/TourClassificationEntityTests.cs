using Domain.Entities;

namespace Domain.Specs.Domain;

public sealed class TourClassificationEntityTests
{
    [Fact]
    public void Create_ShouldSetAllProperties()
    {
        var tourId = Guid.CreateVersion7();
        var entity = TourClassificationEntity.Create(
            tourId, "VIP", 1000m, 900m, 0m, "VIP package", 3, 2, "admin");

        Assert.NotEqual(Guid.Empty, entity.Id);
        Assert.Equal(tourId, entity.TourId);
        Assert.Equal("VIP", entity.Name);
        Assert.Equal(1000m, entity.AdultPrice);
        Assert.Equal(900m, entity.ChildPrice);
        Assert.Equal(0m, entity.InfantPrice);
        Assert.Equal("VIP package", entity.Description);
        Assert.Equal(3, entity.NumberOfDay);
        Assert.Equal(2, entity.NumberOfNight);
        Assert.Equal("admin", entity.CreatedBy);
        Assert.Equal("admin", entity.LastModifiedBy);
    }

    [Fact]
    public void Create_ShouldGenerateUniqueIds()
    {
        var tourId = Guid.CreateVersion7();
        var c1 = TourClassificationEntity.Create(tourId, "VIP", 1000m, 900m, 0m, "desc", 3, 2, "admin");
        var c2 = TourClassificationEntity.Create(tourId, "Standard", 500m, 450m, 0m, "desc", 2, 1, "admin");

        Assert.NotEqual(c1.Id, c2.Id);
    }

    [Fact]
    public void Update_ShouldModifyProperties()
    {
        var entity = TourClassificationEntity.Create(
            Guid.CreateVersion7(), "VIP", 1000m, 900m, 0m, "desc", 3, 2, "admin");

        entity.Update("Premium", 1500m, 1200m, 0m, "Premium package", 5, 4, "editor");

        Assert.Equal("Premium", entity.Name);
        Assert.Equal(1500m, entity.AdultPrice);
        Assert.Equal(1200m, entity.ChildPrice);
        Assert.Equal(0m, entity.InfantPrice);
        Assert.Equal("Premium package", entity.Description);
        Assert.Equal(5, entity.NumberOfDay);
        Assert.Equal(4, entity.NumberOfNight);
        Assert.Equal("editor", entity.LastModifiedBy);
    }
}
