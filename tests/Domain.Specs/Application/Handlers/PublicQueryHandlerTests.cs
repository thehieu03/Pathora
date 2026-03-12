using Application.Features.Public.Queries;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class PublicQueryHandlerTests
{
    // ── GetLatestTours ──────────────────────────────────────

    [Fact]
    public async Task GetLatestToursHandler_ShouldMapTourEntitiesToVms()
    {
        var tourRepo = Substitute.For<ITourRepository>();
        var tours = new List<TourEntity>
        {
            new()
            {
                Id = Guid.CreateVersion7(),
                TourName = "Tour Hạ Long",
                ShortDescription = "Short desc",
                Thumbnail = new ImageEntity { PublicURL = "https://img/thumb.jpg" },
                CreatedOnUtc = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero)
            }
        };
        tourRepo.FindLatestTours(6).Returns(tours);

        var handler = new GetLatestToursQueryHandler(tourRepo);
        var result = await handler.Handle(new GetLatestToursQuery(6), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value);
        Assert.Equal("Tour Hạ Long", result.Value[0].TourName);
        Assert.Equal("https://img/thumb.jpg", result.Value[0].Thumbnail);
        Assert.Equal("Short desc", result.Value[0].ShortDescription);
    }

    [Fact]
    public async Task GetLatestToursHandler_WhenNoTours_ShouldReturnEmptyList()
    {
        var tourRepo = Substitute.For<ITourRepository>();
        tourRepo.FindLatestTours(6).Returns(new List<TourEntity>());

        var handler = new GetLatestToursQueryHandler(tourRepo);
        var result = await handler.Handle(new GetLatestToursQuery(6), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Empty(result.Value);
    }

    [Fact]
    public async Task GetLatestToursHandler_WhenTranslationsExist_ShouldReturnDifferentPayloadForViAndEn()
    {
        var tourRepo = Substitute.For<ITourRepository>();
        tourRepo.FindLatestTours(6).Returns(_ =>
        [
            new TourEntity
            {
                Id = Guid.CreateVersion7(),
                TourName = "Tour Hạ Long",
                ShortDescription = "Mô tả vi",
                Thumbnail = new ImageEntity { PublicURL = "https://img/thumb.jpg" },
                CreatedOnUtc = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero),
                Translations =
                {
                    ["vi"] = new global::Domain.Entities.Translations.TourTranslationData
                    {
                        TourName = "Tour Hạ Long",
                        ShortDescription = "Mô tả vi"
                    },
                    ["en"] = new global::Domain.Entities.Translations.TourTranslationData
                    {
                        TourName = "Ha Long Tour",
                        ShortDescription = "English desc"
                    }
                }
            }
        ]);

        var handler = new GetLatestToursQueryHandler(tourRepo);

        var viResult = await handler.Handle(new GetLatestToursQuery(6, "vi"), CancellationToken.None);
        var enResult = await handler.Handle(new GetLatestToursQuery(6, "en"), CancellationToken.None);

        Assert.False(viResult.IsError);
        Assert.False(enResult.IsError);
        Assert.NotEqual(viResult.Value[0].TourName, enResult.Value[0].TourName);
        Assert.NotEqual(viResult.Value[0].ShortDescription, enResult.Value[0].ShortDescription);
    }

    // ── GetFeaturedTours ────────────────────────────────────

    [Fact]
    public async Task GetFeaturedToursHandler_ShouldExtractClassificationData()
    {
        var tourRepo = Substitute.For<ITourRepository>();
        var classification = TourClassificationEntity.Create(
            Guid.CreateVersion7(), "VIP", 1000m, 900m, 0m, "VIP package", 3, 2, "tester");

        var tour = new TourEntity
        {
            Id = Guid.CreateVersion7(),
            TourName = "Tour Đà Nẵng",
            Thumbnail = new ImageEntity { PublicURL = "https://img/da-nang.jpg" },
            Classifications = [classification],
            CreatedOnUtc = DateTimeOffset.UtcNow
        };
        tourRepo.FindFeaturedTours(8).Returns([tour]);

        var handler = new GetFeaturedToursQueryHandler(tourRepo);
        var result = await handler.Handle(new GetFeaturedToursQuery(8), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value);
        Assert.Equal("Tour Đà Nẵng", result.Value[0].TourName);
        Assert.Equal(3, result.Value[0].DurationDays);
        Assert.Equal(1000m, result.Value[0].Price);
        Assert.Equal(900m, result.Value[0].SalePrice);
        Assert.Equal("VIP", result.Value[0].ClassificationName);
    }

    [Fact]
    public async Task GetFeaturedToursHandler_WhenNoClassification_ShouldDefaultToZero()
    {
        var tourRepo = Substitute.For<ITourRepository>();
        var tour = new TourEntity
        {
            Id = Guid.CreateVersion7(),
            TourName = "Tour Basic",
            Thumbnail = new ImageEntity(),
            Classifications = [],
            CreatedOnUtc = DateTimeOffset.UtcNow
        };
        tourRepo.FindFeaturedTours(8).Returns([tour]);

        var handler = new GetFeaturedToursQueryHandler(tourRepo);
        var result = await handler.Handle(new GetFeaturedToursQuery(8), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value);
        Assert.Equal(0, result.Value[0].DurationDays);
        Assert.Equal(0m, result.Value[0].Price);
        Assert.Null(result.Value[0].ClassificationName);
    }

    [Fact]
    public async Task GetFeaturedToursHandler_ShouldExtractLocationFromRoutes()
    {
        var tourRepo = Substitute.For<ITourRepository>();

        var fromLocation = TourPlanLocationEntity.Create(
            "Paris", LocationType.TouristAttraction, "tester",
            city: "Paris", country: "France");

        var route = TourPlanRouteEntity.Create(1, TransportationType.Walking, "tester");
        route.FromLocation = fromLocation;

        var activity = TourDayActivityEntity.Create(
            Guid.CreateVersion7(), 1, TourDayActivityType.Sightseeing, "Sightseeing", "tester");
        activity.Routes = [route];

        var day = TourDayEntity.Create(Guid.CreateVersion7(), 1, "Day 1", "tester");
        day.Activities = [activity];

        var classification = TourClassificationEntity.Create(
            Guid.CreateVersion7(), "VIP", 500m, 400m, 0m, "desc", 2, 1, "tester");
        classification.Plans = [day];

        var tour = new TourEntity
        {
            Id = Guid.CreateVersion7(),
            TourName = "Paris Tour",
            Thumbnail = new ImageEntity(),
            Classifications = [classification],
            CreatedOnUtc = DateTimeOffset.UtcNow
        };
        tourRepo.FindFeaturedTours(8).Returns([tour]);

        var handler = new GetFeaturedToursQueryHandler(tourRepo);
        var result = await handler.Handle(new GetFeaturedToursQuery(8), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal("Paris, France", result.Value[0].Location);
    }

    [Fact]
    public async Task GetFeaturedToursHandler_WhenTranslationsExist_ShouldReturnDifferentPayloadForViAndEn()
    {
        var tourRepo = Substitute.For<ITourRepository>();
        tourRepo.FindFeaturedTours(8).Returns(_ =>
        [
            new TourEntity
            {
                Id = Guid.CreateVersion7(),
                TourName = "Tour Đà Nẵng",
                Thumbnail = new ImageEntity { PublicURL = "https://img/da-nang.jpg" },
                Classifications =
                [
                    TourClassificationEntity.Create(Guid.CreateVersion7(), "Tiêu chuẩn", 1000m, 900m, 0m, "Gói vi", 3, 2, "tester")
                ],
                Translations =
                {
                    ["vi"] = new global::Domain.Entities.Translations.TourTranslationData
                    {
                        TourName = "Tour Đà Nẵng"
                    },
                    ["en"] = new global::Domain.Entities.Translations.TourTranslationData
                    {
                        TourName = "Da Nang Tour"
                    }
                },
                CreatedOnUtc = DateTimeOffset.UtcNow
            }
        ]);

        var handler = new GetFeaturedToursQueryHandler(tourRepo);

        var viResult = await handler.Handle(new GetFeaturedToursQuery(8, "vi"), CancellationToken.None);
        var enResult = await handler.Handle(new GetFeaturedToursQuery(8, "en"), CancellationToken.None);

        Assert.False(viResult.IsError);
        Assert.False(enResult.IsError);
        Assert.NotEqual(viResult.Value[0].TourName, enResult.Value[0].TourName);
    }

    // ── GetDestinations ─────────────────────────────────────

    [Fact]
    public async Task GetDestinationsHandler_ShouldReturnDestinations()
    {
        var tourRepo = Substitute.For<ITourRepository>();
        tourRepo.GetAllDestinations().Returns(["Hà Nội", "Đà Nẵng", "Phú Quốc"]);

        var handler = new GetDestinationsQueryHandler(tourRepo);
        var result = await handler.Handle(new GetDestinationsQuery(), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(3, result.Value.Count);
        Assert.Contains("Hà Nội", result.Value);
    }

    // ── GetTopAttractions ───────────────────────────────────

    [Fact]
    public async Task GetTopAttractionsHandler_ShouldMapLocationEntities()
    {
        var tourRepo = Substitute.For<ITourRepository>();
        var location = TourPlanLocationEntity.Create(
            "Vịnh Hạ Long", LocationType.TouristAttraction, "tester",
            address: "Quảng Ninh", city: "Hạ Long", country: "Việt Nam");
        tourRepo.GetTopAttractions(8).Returns([location]);

        var handler = new GetTopAttractionsQueryHandler(tourRepo);
        var result = await handler.Handle(new GetTopAttractionsQuery(8), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value);
        Assert.Equal("Vịnh Hạ Long", result.Value[0].Name);
        Assert.Equal("Hạ Long", result.Value[0].City);
        Assert.Equal("Việt Nam", result.Value[0].Country);
    }

    [Fact]
    public async Task GetTopAttractionsHandler_WhenTranslationsExist_ShouldReturnDifferentPayloadForViAndEn()
    {
        var tourRepo = Substitute.For<ITourRepository>();
        tourRepo.GetTopAttractions(8).Returns(_ =>
        [
            new TourPlanLocationEntity
            {
                Id = Guid.CreateVersion7(),
                LocationName = "Vịnh Hạ Long",
                Address = "Quảng Ninh",
                City = "Hạ Long",
                Country = "Việt Nam",
                LocationType = LocationType.TouristAttraction,
                Translations =
                {
                    ["vi"] = new global::Domain.Entities.Translations.TourPlanLocationTranslationData
                    {
                        LocationName = "Vịnh Hạ Long"
                    },
                    ["en"] = new global::Domain.Entities.Translations.TourPlanLocationTranslationData
                    {
                        LocationName = "Ha Long Bay"
                    }
                }
            }
        ]);

        var handler = new GetTopAttractionsQueryHandler(tourRepo);

        var viResult = await handler.Handle(new GetTopAttractionsQuery(8, "vi"), CancellationToken.None);
        var enResult = await handler.Handle(new GetTopAttractionsQuery(8, "en"), CancellationToken.None);

        Assert.False(viResult.IsError);
        Assert.False(enResult.IsError);
        Assert.NotEqual(viResult.Value[0].Name, enResult.Value[0].Name);
    }

    // ── GetTrendingDestinations ─────────────────────────────

    [Fact]
    public async Task GetTrendingDestinationsHandler_ShouldMapTuples()
    {
        var tourRepo = Substitute.For<ITourRepository>();
        tourRepo.GetTrendingDestinations(6)
            .Returns([("Đà Nẵng", "Việt Nam", 15), ("Bangkok", "Thailand", 10)]);

        var handler = new GetTrendingDestinationsQueryHandler(tourRepo);
        var result = await handler.Handle(
            new GetTrendingDestinationsQuery(6), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(2, result.Value.Count);
        Assert.Equal("Đà Nẵng", result.Value[0].City);
        Assert.Equal("Việt Nam", result.Value[0].Country);
        Assert.Equal(15, result.Value[0].ToursCount);
    }

    // ── GetTopReviews ───────────────────────────────────────

    [Fact]
    public async Task GetTopReviewsHandler_ShouldMapReviewEntities()
    {
        var reviewRepo = Substitute.For<IReviewRepository>();
        var review = new ReviewEntity
        {
            Id = Guid.CreateVersion7(),
            Rating = 5,
            Comment = "Amazing tour!",
            User = new UserEntity { Username = "john", AvatarUrl = "https://avatar.jpg" },
            Tour = new TourEntity { TourName = "Tour Hạ Long" },
            CreatedOnUtc = new DateTimeOffset(2026, 3, 1, 0, 0, 0, TimeSpan.Zero)
        };
        reviewRepo.GetTopReviews(6).Returns([review]);

        var handler = new GetTopReviewsQueryHandler(reviewRepo);
        var result = await handler.Handle(new GetTopReviewsQuery(6), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Single(result.Value);
        Assert.Equal("john", result.Value[0].UserName);
        Assert.Equal("https://avatar.jpg", result.Value[0].UserAvatar);
        Assert.Equal("Tour Hạ Long", result.Value[0].TourName);
        Assert.Equal(5, result.Value[0].Rating);
        Assert.Equal("Amazing tour!", result.Value[0].Comment);
    }

    [Fact]
    public async Task GetTopReviewsHandler_WhenNoReviews_ShouldReturnEmptyList()
    {
        var reviewRepo = Substitute.For<IReviewRepository>();
        reviewRepo.GetTopReviews(6).Returns(new List<ReviewEntity>());

        var handler = new GetTopReviewsQueryHandler(reviewRepo);
        var result = await handler.Handle(new GetTopReviewsQuery(6), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Empty(result.Value);
    }
}
