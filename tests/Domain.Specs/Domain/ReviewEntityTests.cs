using Domain.Entities;

namespace Domain.Specs.Domain;

public sealed class ReviewEntityTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    public void Create_WhenRatingOutOfRange_ShouldThrowArgumentOutOfRangeException(int rating)
    {
        var userId = Guid.CreateVersion7();
        var tourId = Guid.CreateVersion7();

        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            ReviewEntity.Create(userId, tourId, rating, "bad rating", "tester"));

        Assert.Equal("rating", exception.ParamName);
    }
}
