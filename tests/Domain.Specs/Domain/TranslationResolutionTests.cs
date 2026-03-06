using Domain.Entities;
using Domain.Entities.Translations;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class TranslationResolutionTests
{
    [Fact]
    public void Tour_ResolveTranslation_ShouldPreferRequestedLanguage()
    {
        var tour = TourEntity.Create("Tên gốc", "Mô tả ngắn gốc", "Mô tả dài gốc", "tester");
        tour.Translations["vi"] = new TourTranslationData
        {
            TourName = "Tour tiếng Việt",
            ShortDescription = "Mô tả ngắn vi",
            LongDescription = "Mô tả dài vi",
            SEOTitle = "SEO vi",
            SEODescription = "SEO desc vi"
        };
        tour.Translations["en"] = new TourTranslationData
        {
            TourName = "English tour",
            ShortDescription = "English short",
            LongDescription = "English long",
            SEOTitle = "SEO en",
            SEODescription = "SEO desc en"
        };

        var resolved = tour.ResolveTranslation("en");

        Assert.Equal("English tour", resolved.TourName);
        Assert.Equal("English short", resolved.ShortDescription);
        Assert.Equal("English long", resolved.LongDescription);
        Assert.Equal("SEO en", resolved.SEOTitle);
        Assert.Equal("SEO desc en", resolved.SEODescription);
    }

    [Fact]
    public void Tour_ResolveTranslation_ShouldFallbackToVietnameseWhenRequestedMissing()
    {
        var tour = TourEntity.Create("Tên gốc", "Mô tả ngắn gốc", "Mô tả dài gốc", "tester");
        tour.Translations["vi"] = new TourTranslationData
        {
            TourName = "Tour tiếng Việt",
            ShortDescription = "Mô tả ngắn vi",
            LongDescription = "Mô tả dài vi"
        };

        var resolved = tour.ResolveTranslation("en");

        Assert.Equal("Tour tiếng Việt", resolved.TourName);
        Assert.Equal("Mô tả ngắn vi", resolved.ShortDescription);
        Assert.Equal("Mô tả dài vi", resolved.LongDescription);
    }

    [Fact]
    public void Tour_ResolveTranslation_ShouldFallbackToRootFieldsWhenTranslationsEmpty()
    {
        var tour = TourEntity.Create("Tên gốc", "Mô tả ngắn gốc", "Mô tả dài gốc", "tester");

        var resolved = tour.ResolveTranslation("en");

        Assert.Equal("Tên gốc", resolved.TourName);
        Assert.Equal("Mô tả ngắn gốc", resolved.ShortDescription);
        Assert.Equal("Mô tả dài gốc", resolved.LongDescription);
    }

    [Fact]
    public void Tour_ApplyResolvedTranslations_ShouldApplyNestedEntities()
    {
        var tour = TourEntity.Create("Tên gốc", "Mô tả ngắn gốc", "Mô tả dài gốc", "tester");
        tour.Translations["en"] = new TourTranslationData
        {
            TourName = "English tour",
            ShortDescription = "English short",
            LongDescription = "English long"
        };

        var classification = TourClassificationEntity.Create(tour.Id, "Phân loại vi", 1000m, 900m, "Mô tả vi", 2, "tester");
        classification.Translations["en"] = new TourClassificationTranslationData
        {
            Name = "English classification",
            Description = "English classification description"
        };

        var day = TourDayEntity.Create(classification.Id, 1, "Ngày 1", "tester", "Mô tả ngày");
        day.Translations["en"] = new TourDayTranslationData
        {
            Title = "Day 1",
            Description = "Day 1 description"
        };

        var activity = TourDayActivityEntity.Create(day.Id, 1, TourDayActivityType.Sightseeing, "Hoạt động", "tester", "Mô tả hoạt động", "Ghi chú");
        activity.Translations["en"] = new TourDayActivityTranslationData
        {
            Title = "Activity",
            Description = "Activity description",
            Note = "Activity note"
        };

        var location = TourPlanLocationEntity.Create("Địa điểm", LocationType.TouristAttraction, "tester", "Mô tả địa điểm", note: "Ghi chú địa điểm");
        location.Translations["en"] = new TourPlanLocationTranslationData
        {
            LocationName = "Location",
            LocationDescription = "Location description",
            Note = "Location note"
        };

        var accommodation = TourPlanAccommodationEntity.Create("Khách sạn", RoomType.Double, 2, MealType.Breakfast, "tester", specialRequest: "Yêu cầu", note: "Ghi chú");
        accommodation.Translations["en"] = new TourPlanAccommodationTranslationData
        {
            AccommodationName = "Hotel",
            SpecialRequest = "Request",
            Note = "Accommodation note"
        };

        var route = TourPlanRouteEntity.Create(1, TransportationType.Bus, "tester", transportationName: "Xe buýt", transportationNote: "Ghi chú xe", note: "Ghi chú route");
        route.Translations["en"] = new TourPlanRouteTranslationData
        {
            TransportationName = "Bus",
            TransportationNote = "Bus note",
            Note = "Route note"
        };
        route.FromLocation = location;
        route.ToLocation = location;

        activity.Routes = [route];
        activity.Accommodation = accommodation;
        day.Activities = [activity];
        classification.Plans = [day];
        tour.Classifications = [classification];

        tour.ApplyResolvedTranslations("en");

        Assert.Equal("English tour", tour.TourName);
        Assert.Equal("English classification", classification.Name);
        Assert.Equal("Day 1", day.Title);
        Assert.Equal("Activity", activity.Title);
        Assert.Equal("Location", location.LocationName);
        Assert.Equal("Hotel", accommodation.AccommodationName);
        Assert.Equal("Bus", route.TransportationName);
    }
}
