using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class TourPlanAccommodationEntityTests
{
    [Fact]
    public void Create_ShouldSetAllProperties()
    {
        var entity = TourPlanAccommodationEntity.Create(
            "Hotel Hilton", RoomType.Double, 4, MealType.Breakfast, "admin",
            new TimeOnly(14, 0), new TimeOnly(12, 0), 2000000m, 2, 1, 4000000m,
            "Sea view", "123 Beach Rd", "Đà Nẵng", "0901234567",
            "https://hilton.com", "https://img.jpg", 16.05m, 108.20m, "VIP floor");

        Assert.NotEqual(Guid.Empty, entity.Id);
        Assert.Equal("Hotel Hilton", entity.AccommodationName);
        Assert.Equal(RoomType.Double, entity.RoomType);
        Assert.Equal(4, entity.RoomCapacity);
        Assert.Equal(MealType.Breakfast, entity.MealsIncluded);
        Assert.Equal(new TimeOnly(14, 0), entity.CheckInTime);
        Assert.Equal(new TimeOnly(12, 0), entity.CheckOutTime);
        Assert.Equal(2000000m, entity.RoomPrice);
        Assert.Equal(2, entity.NumberOfRooms);
        Assert.Equal(1, entity.NumberOfNights);
        Assert.Equal("Đà Nẵng", entity.City);
        Assert.Equal("admin", entity.CreatedBy);
    }

    [Fact]
    public void Create_WithMinimalParams_ShouldHaveNullOptionals()
    {
        var entity = TourPlanAccommodationEntity.Create(
            "Hostel", RoomType.Single, 2, MealType.None, "admin");

        Assert.Null(entity.CheckInTime);
        Assert.Null(entity.CheckOutTime);
        Assert.Null(entity.RoomPrice);
        Assert.Null(entity.NumberOfRooms);
        Assert.Null(entity.City);
    }

    [Fact]
    public void Update_ShouldModifyProperties()
    {
        var entity = TourPlanAccommodationEntity.Create(
            "Old Hotel", RoomType.Single, 2, MealType.None, "admin");

        entity.Update("New Resort", RoomType.Suite, 6, MealType.AllMeals, "editor",
            new TimeOnly(15, 0), new TimeOnly(11, 0), 5000000m);

        Assert.Equal("New Resort", entity.AccommodationName);
        Assert.Equal(RoomType.Suite, entity.RoomType);
        Assert.Equal(6, entity.RoomCapacity);
        Assert.Equal(MealType.AllMeals, entity.MealsIncluded);
        Assert.Equal(5000000m, entity.RoomPrice);
        Assert.Equal("editor", entity.LastModifiedBy);
    }
}
