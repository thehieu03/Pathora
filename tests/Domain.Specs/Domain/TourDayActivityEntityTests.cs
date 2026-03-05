using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class TourDayActivityEntityTests
{
    [Fact]
    public void Create_ShouldSetAllProperties()
    {
        var dayId = Guid.CreateVersion7();
        var entity = TourDayActivityEntity.Create(
            dayId, 1, TourDayActivityType.Sightseeing, "Visit Temple", "admin",
            "Visit ancient temple", "Bring water",
            new TimeOnly(8, 0), new TimeOnly(12, 0), 50m, false);

        Assert.NotEqual(Guid.Empty, entity.Id);
        Assert.Equal(dayId, entity.TourDayId);
        Assert.Equal(1, entity.Order);
        Assert.Equal(TourDayActivityType.Sightseeing, entity.ActivityType);
        Assert.Equal("Visit Temple", entity.Title);
        Assert.Equal("Visit ancient temple", entity.Description);
        Assert.Equal("Bring water", entity.Note);
        Assert.Equal(new TimeOnly(8, 0), entity.StartTime);
        Assert.Equal(new TimeOnly(12, 0), entity.EndTime);
        Assert.Equal(50m, entity.EstimatedCost);
        Assert.False(entity.IsOptional);
        Assert.Equal("admin", entity.CreatedBy);
    }

    [Fact]
    public void Create_WithDefaults_ShouldHaveNullOptionals()
    {
        var entity = TourDayActivityEntity.Create(
            Guid.CreateVersion7(), 1, TourDayActivityType.Dining, "Lunch", "admin");

        Assert.Null(entity.Description);
        Assert.Null(entity.Note);
        Assert.Null(entity.StartTime);
        Assert.Null(entity.EndTime);
        Assert.Null(entity.EstimatedCost);
        Assert.False(entity.IsOptional);
    }

    [Fact]
    public void Update_ShouldModifyProperties()
    {
        var entity = TourDayActivityEntity.Create(
            Guid.CreateVersion7(), 1, TourDayActivityType.Sightseeing, "Original", "admin");

        entity.Update(2, TourDayActivityType.Dining, "Updated", "editor",
            "New desc", "New note", new TimeOnly(18, 0), new TimeOnly(20, 0), 100m, true);

        Assert.Equal(2, entity.Order);
        Assert.Equal(TourDayActivityType.Dining, entity.ActivityType);
        Assert.Equal("Updated", entity.Title);
        Assert.Equal("New desc", entity.Description);
        Assert.Equal(100m, entity.EstimatedCost);
        Assert.True(entity.IsOptional);
        Assert.Equal("editor", entity.LastModifiedBy);
    }
}
