using Application.Features.Public.Queries;
using Application.Mapping;
using AutoMapper;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Entities.Translations;
using Domain.Enums;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Domain.Specs.Application;

public sealed class GetPublicTourDetailNoTrackingTranslationTests
{
    [Fact]
    public async Task Handle_WhenLoadedAsNoTracking_ShouldResolveRouteLocationsWithoutLazyLoadingException()
    {
        // Arrange
        var options = CreateOptions(Guid.NewGuid().ToString("N"));
        var tourId = await SeedTourAsync(options);

        using var dbContext = new AppDbContext(options);
        ITourRepository repository = new TourRepository(dbContext);
        var mapper = CreateMapper();
        ILanguageContext languageContext = new StaticLanguageContext("en");

        var handler = new GetPublicTourDetailQueryHandler(repository, mapper, languageContext);

        // Act
        var result = await handler.Handle(new GetPublicTourDetailQuery(tourId), CancellationToken.None);

        // Assert
        Assert.False(result.IsError);
        var route = result.Value.Classifications[0].Plans[0].Activities[0].Routes[0];
        Assert.Equal("English Paris", route.FromLocation!.LocationName);
        Assert.Equal("English Lyon", route.ToLocation!.LocationName);
    }

    private static IMapper CreateMapper()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<TourProfile>());
        return config.CreateMapper();
    }

    private static DbContextOptions<AppDbContext> CreateOptions(string databaseName)
    {
        return new DbContextOptionsBuilder<AppDbContext>()
            .UseLazyLoadingProxies(proxyOptions =>
            {
                proxyOptions.IgnoreNonVirtualNavigations();
            })
            .UseInMemoryDatabase(databaseName)
            .Options;
    }

    private static async Task<Guid> SeedTourAsync(DbContextOptions<AppDbContext> options)
    {
        using var dbContext = new AppDbContext(options);

        var tour = TourEntity.Create("Tour tiếng Việt", "Mô tả ngắn", "Mô tả dài", "tester", TourStatus.Active);
        tour.Translations["en"] = new TourTranslationData
        {
            TourName = "English Tour",
            ShortDescription = "English short",
            LongDescription = "English long"
        };

        var classification = TourClassificationEntity.Create(tour.Id, "VIP", 1000m, 900m, "Mô tả hạng", 3, "tester");
        classification.Translations["en"] = new TourClassificationTranslationData
        {
            Name = "English VIP",
            Description = "English class description"
        };

        var day = TourDayEntity.Create(classification.Id, 1, "Ngày 1", "tester");
        day.Translations["en"] = new TourDayTranslationData
        {
            Title = "English Day 1",
            Description = "English day description"
        };

        var activity = TourDayActivityEntity.Create(day.Id, 1, TourDayActivityType.Sightseeing, "Tham quan", "tester");
        activity.Translations["en"] = new TourDayActivityTranslationData
        {
            Title = "English Visit",
            Description = "English visit description",
            Note = "English note"
        };

        var fromLocation = TourPlanLocationEntity.Create(
            "Paris",
            LocationType.TouristAttraction,
            "tester",
            city: "Paris",
            country: "France");
        fromLocation.Translations["en"] = new TourPlanLocationTranslationData
        {
            LocationName = "English Paris",
            LocationDescription = "English Paris description",
            Note = "English from note"
        };

        var toLocation = TourPlanLocationEntity.Create(
            "Lyon",
            LocationType.TouristAttraction,
            "tester",
            city: "Lyon",
            country: "France");
        toLocation.Translations["en"] = new TourPlanLocationTranslationData
        {
            LocationName = "English Lyon",
            LocationDescription = "English Lyon description",
            Note = "English to note"
        };

        var route = TourPlanRouteEntity.Create(1, TransportationType.Walking, "tester");
        route.Translations["en"] = new TourPlanRouteTranslationData
        {
            TransportationName = "English walk",
            TransportationNote = "English transport note",
            Note = "English route note"
        };

        var accommodation = TourPlanAccommodationEntity.Create("Khách sạn", RoomType.Double, 2, MealType.None, "tester");
        accommodation.Translations["en"] = new TourPlanAccommodationTranslationData
        {
            AccommodationName = "English Hotel",
            SpecialRequest = "English request",
            Note = "English accommodation note"
        };

        var insurance = TourInsuranceEntity.Create(
            "Bảo hiểm",
            InsuranceType.Travel,
            "Allianz",
            "Mô tả bảo hiểm",
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

    private sealed class StaticLanguageContext(string currentLanguage) : ILanguageContext
    {
        public string CurrentLanguage { get; set; } = currentLanguage;
    }
}
