using Domain.Entities;
using Domain.Enums;

namespace Domain.Specs.Domain;

public sealed class TourEntityTests
{
    [Fact]
    public void Create_ShouldAutoGenerateTourCode()
    {
        var tour = TourEntity.Create("Tour Test", "Short", "Long", "tester");

        Assert.NotNull(tour.TourCode);
        Assert.StartsWith("TOUR-", tour.TourCode);
        Assert.Matches(@"^TOUR-\d{8}-\d{5}$", tour.TourCode);
    }

    [Fact]
    public void Create_ShouldGenerateUniqueIds()
    {
        var tour1 = TourEntity.Create("Tour 1", "Short 1", "Long 1", "tester");
        var tour2 = TourEntity.Create("Tour 2", "Short 2", "Long 2", "tester");

        Assert.NotEqual(tour1.Id, tour2.Id);
        Assert.NotEqual(tour1.TourCode, tour2.TourCode);
    }

    [Fact]
    public void Create_ShouldSetAllProperties()
    {
        var thumbnail = ImageEntity.Create("f1", "thumb.jpg", "thumb.jpg", "http://cdn/thumb.jpg");
        var images = new List<ImageEntity>
        {
            ImageEntity.Create("f2", "img1.jpg", "img1.jpg", "http://cdn/img1.jpg"),
            ImageEntity.Create("f3", "img2.jpg", "img2.jpg", "http://cdn/img2.jpg"),
        };

        var tour = TourEntity.Create(
            "Tour Đà Nẵng", "Mô tả ngắn", "Mô tả dài", "admin",
            TourStatus.Active, "SEO Title", "SEO Desc", thumbnail, images);

        Assert.Equal("Tour Đà Nẵng", tour.TourName);
        Assert.Equal("Mô tả ngắn", tour.ShortDescription);
        Assert.Equal("Mô tả dài", tour.LongDescription);
        Assert.Equal(TourStatus.Active, tour.Status);
        Assert.Equal("SEO Title", tour.SEOTitle);
        Assert.Equal("SEO Desc", tour.SEODescription);
        Assert.Equal("admin", tour.CreatedBy);
        Assert.False(tour.IsDeleted);
        Assert.Equal("thumb.jpg", tour.Thumbnail.OriginalFileName);
        Assert.Equal(2, tour.Images.Count);
    }

    [Fact]
    public void Create_WithMultipleImages_ShouldStoreAllImages()
    {
        var images = Enumerable.Range(1, 5)
            .Select(i => ImageEntity.Create($"f{i}", $"img{i}.jpg", $"img{i}.jpg", $"http://cdn/img{i}.jpg"))
            .ToList();

        var tour = TourEntity.Create("Tour", "Short", "Long", "tester", images: images);

        Assert.Equal(5, tour.Images.Count);
        for (int i = 0; i < 5; i++)
        {
            Assert.Equal($"f{i + 1}", tour.Images[i].FileId);
        }
    }

    [Fact]
    public void Create_WithNoImages_ShouldHaveEmptyList()
    {
        var tour = TourEntity.Create("Tour", "Short", "Long", "tester");

        Assert.NotNull(tour.Images);
        Assert.Empty(tour.Images);
    }

    [Fact]
    public void Create_WithNoThumbnail_ShouldCreateDefaultThumbnail()
    {
        var tour = TourEntity.Create("Tour", "Short", "Long", "tester");

        Assert.NotNull(tour.Thumbnail);
        Assert.Null(tour.Thumbnail.FileId);
    }

    [Fact]
    public void Create_ShouldDefaultToPendingStatus()
    {
        var tour = TourEntity.Create("Tour", "Short", "Long", "tester");

        Assert.Equal(TourStatus.Pending, tour.Status);
    }

    [Fact]
    public void Update_ShouldModifyProperties()
    {
        var tour = TourEntity.Create("Original", "Short", "Long", "creator", TourStatus.Pending);

        tour.Update("Updated Tour", "New Short", "New Long", TourStatus.Active, "editor",
            "New SEO Title", "New SEO Desc");

        Assert.Equal("Updated Tour", tour.TourName);
        Assert.Equal("New Short", tour.ShortDescription);
        Assert.Equal("New Long", tour.LongDescription);
        Assert.Equal(TourStatus.Active, tour.Status);
        Assert.Equal("New SEO Title", tour.SEOTitle);
        Assert.Equal("New SEO Desc", tour.SEODescription);
        Assert.Equal("editor", tour.LastModifiedBy);
    }

    [Fact]
    public void Update_WithNewThumbnail_ShouldReplaceThumbnail()
    {
        var oldThumb = ImageEntity.Create("old", "old.jpg", "old.jpg", "http://cdn/old.jpg");
        var tour = TourEntity.Create("Tour", "Short", "Long", "tester", thumbnail: oldThumb);

        var newThumb = ImageEntity.Create("new", "new.jpg", "new.jpg", "http://cdn/new.jpg");
        tour.Update("Tour", "Short", "Long", TourStatus.Active, "editor", thumbnail: newThumb);

        Assert.Equal("new", tour.Thumbnail.FileId);
        Assert.Equal("new.jpg", tour.Thumbnail.OriginalFileName);
    }

    [Fact]
    public void Update_WithNullThumbnail_ShouldKeepExistingThumbnail()
    {
        var thumb = ImageEntity.Create("keep", "keep.jpg", "keep.jpg", "http://cdn/keep.jpg");
        var tour = TourEntity.Create("Tour", "Short", "Long", "tester", thumbnail: thumb);

        tour.Update("Tour", "Short", "Long", TourStatus.Active, "editor", thumbnail: null);

        Assert.Equal("keep", tour.Thumbnail.FileId);
    }

    [Fact]
    public void Update_WithNewImages_ShouldReplaceAllImages()
    {
        var oldImages = new List<ImageEntity>
        {
            ImageEntity.Create("old1", "old1.jpg", "old1.jpg", "http://cdn/old1.jpg"),
        };
        var tour = TourEntity.Create("Tour", "Short", "Long", "tester", images: oldImages);

        var newImages = new List<ImageEntity>
        {
            ImageEntity.Create("new1", "new1.jpg", "new1.jpg", "http://cdn/new1.jpg"),
            ImageEntity.Create("new2", "new2.jpg", "new2.jpg", "http://cdn/new2.jpg"),
            ImageEntity.Create("new3", "new3.jpg", "new3.jpg", "http://cdn/new3.jpg"),
        };
        tour.Update("Tour", "Short", "Long", TourStatus.Active, "editor", images: newImages);

        Assert.Equal(3, tour.Images.Count);
        Assert.Equal("new1", tour.Images[0].FileId);
        Assert.Equal("new2", tour.Images[1].FileId);
        Assert.Equal("new3", tour.Images[2].FileId);
    }

    [Fact]
    public void Update_WithNullImages_ShouldKeepExistingImages()
    {
        var images = new List<ImageEntity>
        {
            ImageEntity.Create("keep", "keep.jpg", "keep.jpg", "http://cdn/keep.jpg"),
        };
        var tour = TourEntity.Create("Tour", "Short", "Long", "tester", images: images);

        tour.Update("Tour", "Short", "Long", TourStatus.Active, "editor", images: null);

        Assert.Single(tour.Images);
        Assert.Equal("keep", tour.Images[0].FileId);
    }

    [Fact]
    public void SoftDelete_ShouldSetIsDeletedTrue()
    {
        var tour = TourEntity.Create("Tour", "Short", "Long", "tester");

        tour.SoftDelete("admin");

        Assert.True(tour.IsDeleted);
        Assert.Equal("admin", tour.LastModifiedBy);
    }

    [Fact]
    public void GenerateTourCode_ShouldFollowFormat()
    {
        var code = TourEntity.GenerateTourCode();

        Assert.Matches(@"^TOUR-\d{8}-\d{5}$", code);
        var datePart = code.Substring(5, 8);
        Assert.Equal(DateTimeOffset.UtcNow.ToString("yyyyMMdd"), datePart);
    }
}
