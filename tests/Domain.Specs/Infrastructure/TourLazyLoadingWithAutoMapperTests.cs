using Application.Dtos;
using Application.Mapping;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Domain.Specs.Infrastructure;

public sealed class TourLazyLoadingWithAutoMapperTests
{
    [Fact]
    public async Task MappingTourDto_ShouldLazyLoadNestedNavigations_WhenTourIsLoadedWithoutIncludes()
    {
        var databaseName = Guid.NewGuid().ToString("N");
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseLazyLoadingProxies(proxyOptions =>
            {
                proxyOptions.IgnoreNonVirtualNavigations();
            })
            .UseInMemoryDatabase(databaseName)
            .Options;

        var tourId = await SeedTourAsync(options);

        using var dbContext = new AppDbContext(options);
        var mapper = CreateMapper();

        var tour = await dbContext.Tours.FirstAsync(t => t.Id == tourId);

        Assert.False(dbContext.Entry(tour).Collection(t => t.Classifications).IsLoaded);

        var dto = mapper.Map<TourDto>(tour);

        Assert.True(dbContext.Entry(tour).Collection(t => t.Classifications).IsLoaded);
        Assert.Single(dto.Classifications);
        Assert.Single(dto.Classifications[0].Plans);
        Assert.Single(dto.Classifications[0].Insurances);
        Assert.Single(dto.Classifications[0].Plans[0].Activities);
        Assert.Single(dto.Classifications[0].Plans[0].Activities[0].Routes);
        Assert.NotNull(dto.Classifications[0].Plans[0].Activities[0].Accommodation);
        Assert.Equal("Paris", dto.Classifications[0].Plans[0].Activities[0].Routes[0].FromLocation!.LocationName);
    }

    private static IMapper CreateMapper()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<TourProfile>());
        return config.CreateMapper();
    }

    private static async Task<Guid> SeedTourAsync(DbContextOptions<AppDbContext> options)
    {
        using var dbContext = new AppDbContext(options);

        var tour = TourEntity.Create("Paris Tour", "Short", "Long", "tester", TourStatus.Active);
        var classification = TourClassificationEntity.Create(tour.Id, "VIP", 1000m, 900m, "Description", 3, "tester");
        var day = TourDayEntity.Create(classification.Id, 1, "Day 1", "tester");
        var activity = TourDayActivityEntity.Create(day.Id, 1, TourDayActivityType.Sightseeing, "Visit", "tester");

        var fromLocation = TourPlanLocationEntity.Create(
            "Paris",
            LocationType.TouristAttraction,
            "tester",
            city: "Paris",
            country: "France");

        var toLocation = TourPlanLocationEntity.Create(
            "Lyon",
            LocationType.TouristAttraction,
            "tester",
            city: "Lyon",
            country: "France");

        var route = TourPlanRouteEntity.Create(1, TransportationType.Walking, "tester");
        var accommodation = TourPlanAccommodationEntity.Create("Hotel", RoomType.Double, 2, MealType.None, "tester");
        var insurance = TourInsuranceEntity.Create(
            "Travel Insurance",
            InsuranceType.Travel,
            "Allianz",
            "Full coverage",
            100000m,
            50m,
            "tester",
            isOptional: true);

        classification.Tour = tour;
        day.Classification = classification;
        activity.TourDay = day;
        route.TourDayActivity = activity;
        route.FromLocation = fromLocation;
        route.ToLocation = toLocation;
        fromLocation.TourDayActivity = activity;
        toLocation.TourDayActivity = activity;
        accommodation.TourDayActivity = activity;
        insurance.TourClassification = classification;

        activity.Routes = [route];
        activity.Accommodation = accommodation;
        day.Activities = [activity];
        classification.Plans = [day];
        classification.Insurances = [insurance];
        tour.Classifications = [classification];

        dbContext.Tours.Add(tour);
        await dbContext.SaveChangesAsync();

        return tour.Id;
    }
}
