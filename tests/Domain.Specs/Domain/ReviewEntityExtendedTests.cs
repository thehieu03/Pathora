using Domain.Entities;

namespace Domain.Specs.Domain;

public sealed class ReviewEntityExtendedTests
{
    [Fact]
    public void Create_WithValidRating_ShouldSucceed()
    {
        var userId = Guid.CreateVersion7();
        var tourId = Guid.CreateVersion7();

        var review = ReviewEntity.Create(userId, tourId, 5, "Excellent tour!", "admin");

        Assert.NotEqual(Guid.Empty, review.Id);
        Assert.Equal(userId, review.UserId);
        Assert.Equal(tourId, review.TourId);
        Assert.Equal(5, review.Rating);
        Assert.Equal("Excellent tour!", review.Comment);
        Assert.False(review.IsApproved);
        Assert.Equal("admin", review.CreatedBy);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(3)]
    [InlineData(5)]
    public void Create_WhenRatingInRange_ShouldNotThrow(int rating)
    {
        var review = ReviewEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), rating, "ok", "admin");
        Assert.Equal(rating, review.Rating);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(6)]
    [InlineData(100)]
    public void Create_WhenRatingOutOfRange_ShouldThrow(int rating)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() =>
            ReviewEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), rating, "bad", "admin"));
    }

    [Fact]
    public void Create_WithNullComment_ShouldSucceed()
    {
        var review = ReviewEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), 4, null, "admin");
        Assert.Null(review.Comment);
    }

    [Fact]
    public void Approve_ShouldSetIsApprovedTrue()
    {
        var review = ReviewEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), 4, "Good", "admin");
        Assert.False(review.IsApproved);

        review.Approve("moderator");

        Assert.True(review.IsApproved);
        Assert.Equal("moderator", review.LastModifiedBy);
    }

    [Fact]
    public void Update_ShouldModifyRatingAndComment()
    {
        var review = ReviewEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), 3, "OK", "admin");

        review.Update(5, "Actually great!", "admin");

        Assert.Equal(5, review.Rating);
        Assert.Equal("Actually great!", review.Comment);
        Assert.Equal("admin", review.LastModifiedBy);
    }

    [Fact]
    public void Update_WhenNewRatingOutOfRange_ShouldThrow()
    {
        var review = ReviewEntity.Create(Guid.CreateVersion7(), Guid.CreateVersion7(), 3, "OK", "admin");

        Assert.Throws<ArgumentOutOfRangeException>(() =>
            review.Update(0, "Bad update", "admin"));
    }
}
