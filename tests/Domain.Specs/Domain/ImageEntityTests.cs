using Domain.Entities;

namespace Domain.Specs.Domain;

public sealed class ImageEntityTests
{
    [Fact]
    public void Create_ShouldSetAllProperties()
    {
        var entity = ImageEntity.Create("file-123", "photo.jpg", "photo_resized.jpg", "https://cdn/photo.jpg");

        Assert.Equal("file-123", entity.FileId);
        Assert.Equal("photo.jpg", entity.OriginalFileName);
        Assert.Equal("photo_resized.jpg", entity.FileName);
        Assert.Equal("https://cdn/photo.jpg", entity.PublicURL);
    }

    [Fact]
    public void Create_TwoImages_ShouldBeIndependent()
    {
        var img1 = ImageEntity.Create("f1", "img1.jpg", "img1.jpg", "https://cdn/img1.jpg");
        var img2 = ImageEntity.Create("f2", "img2.jpg", "img2.jpg", "https://cdn/img2.jpg");

        Assert.NotEqual(img1.FileId, img2.FileId);
        Assert.NotEqual(img1.OriginalFileName, img2.OriginalFileName);
    }
}
