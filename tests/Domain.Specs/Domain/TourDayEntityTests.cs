using Domain.Entities;

namespace Domain.Specs.Domain;

public sealed class TourDayEntityTests
{
    [Fact]
    public void Create_ShouldSetAllProperties()
    {
        var classificationId = Guid.CreateVersion7();
        var entity = TourDayEntity.Create(classificationId, 1, "Day 1 - Hà Nội", "admin", "Explore Hà Nội");

        Assert.NotEqual(Guid.Empty, entity.Id);
        Assert.Equal(classificationId, entity.ClassificationId);
        Assert.Equal(1, entity.DayNumber);
        Assert.Equal("Day 1 - Hà Nội", entity.Title);
        Assert.Equal("Explore Hà Nội", entity.Description);
        Assert.Equal("admin", entity.CreatedBy);
    }

    [Fact]
    public void Create_WithNullDescription_ShouldAllowNull()
    {
        var entity = TourDayEntity.Create(Guid.CreateVersion7(), 1, "Day 1", "admin");

        Assert.Null(entity.Description);
    }

    [Fact]
    public void Update_ShouldModifyProperties()
    {
        var entity = TourDayEntity.Create(Guid.CreateVersion7(), 1, "Day 1", "admin");

        entity.Update(2, "Day 2 - Hạ Long", "editor", "Visit Hạ Long Bay");

        Assert.Equal(2, entity.DayNumber);
        Assert.Equal("Day 2 - Hạ Long", entity.Title);
        Assert.Equal("Visit Hạ Long Bay", entity.Description);
        Assert.Equal("editor", entity.LastModifiedBy);
    }
}
