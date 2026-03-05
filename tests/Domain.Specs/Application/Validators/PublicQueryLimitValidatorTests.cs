using Application.Features.Public.Queries;
using Application.Features.Public.Validators;
using FluentValidation.TestHelper;

namespace Domain.Specs.Application.Validators;

public sealed class PublicQueryLimitValidatorTests
{
    // ── GetTopReviewsQuery ──────────────────────────────────

    [Fact]
    public void TopReviews_WhenLimitValid_ShouldPass()
    {
        var validator = new GetTopReviewsQueryValidator();
        var result = validator.TestValidate(new GetTopReviewsQuery(6));
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public void TopReviews_WhenLimitOutOfRange_ShouldHaveError(int limit)
    {
        var validator = new GetTopReviewsQueryValidator();
        var result = validator.TestValidate(new GetTopReviewsQuery(limit));
        result.ShouldHaveValidationErrorFor(x => x.Limit);
    }

    // ── GetFeaturedToursQuery ───────────────────────────────

    [Fact]
    public void FeaturedTours_WhenLimitValid_ShouldPass()
    {
        var validator = new GetFeaturedToursQueryValidator();
        var result = validator.TestValidate(new GetFeaturedToursQuery(8));
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public void FeaturedTours_WhenLimitOutOfRange_ShouldHaveError(int limit)
    {
        var validator = new GetFeaturedToursQueryValidator();
        var result = validator.TestValidate(new GetFeaturedToursQuery(limit));
        result.ShouldHaveValidationErrorFor(x => x.Limit);
    }

    // ── GetLatestToursQuery ─────────────────────────────────

    [Fact]
    public void LatestTours_WhenLimitValid_ShouldPass()
    {
        var validator = new GetLatestToursQueryValidator();
        var result = validator.TestValidate(new GetLatestToursQuery(6));
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public void LatestTours_WhenLimitOutOfRange_ShouldHaveError(int limit)
    {
        var validator = new GetLatestToursQueryValidator();
        var result = validator.TestValidate(new GetLatestToursQuery(limit));
        result.ShouldHaveValidationErrorFor(x => x.Limit);
    }

    // ── GetTopAttractionsQuery ──────────────────────────────

    [Fact]
    public void TopAttractions_WhenLimitValid_ShouldPass()
    {
        var validator = new GetTopAttractionsQueryValidator();
        var result = validator.TestValidate(new GetTopAttractionsQuery(8));
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public void TopAttractions_WhenLimitOutOfRange_ShouldHaveError(int limit)
    {
        var validator = new GetTopAttractionsQueryValidator();
        var result = validator.TestValidate(new GetTopAttractionsQuery(limit));
        result.ShouldHaveValidationErrorFor(x => x.Limit);
    }

    // ── GetTrendingDestinationsQuery ────────────────────────

    [Fact]
    public void TrendingDestinations_WhenLimitValid_ShouldPass()
    {
        var validator = new GetTrendingDestinationsQueryValidator();
        var result = validator.TestValidate(new GetTrendingDestinationsQuery(6));
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public void TrendingDestinations_WhenLimitOutOfRange_ShouldHaveError(int limit)
    {
        var validator = new GetTrendingDestinationsQueryValidator();
        var result = validator.TestValidate(new GetTrendingDestinationsQuery(limit));
        result.ShouldHaveValidationErrorFor(x => x.Limit);
    }

    // ── Boundary tests ──────────────────────────────────────

    [Fact]
    public void AllValidators_WhenLimitIs1_ShouldPass()
    {
        new GetTopReviewsQueryValidator().TestValidate(new GetTopReviewsQuery(1)).ShouldNotHaveAnyValidationErrors();
        new GetFeaturedToursQueryValidator().TestValidate(new GetFeaturedToursQuery(1)).ShouldNotHaveAnyValidationErrors();
        new GetLatestToursQueryValidator().TestValidate(new GetLatestToursQuery(1)).ShouldNotHaveAnyValidationErrors();
        new GetTopAttractionsQueryValidator().TestValidate(new GetTopAttractionsQuery(1)).ShouldNotHaveAnyValidationErrors();
        new GetTrendingDestinationsQueryValidator().TestValidate(new GetTrendingDestinationsQuery(1)).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void AllValidators_WhenLimitIs50_ShouldPass()
    {
        new GetTopReviewsQueryValidator().TestValidate(new GetTopReviewsQuery(50)).ShouldNotHaveAnyValidationErrors();
        new GetFeaturedToursQueryValidator().TestValidate(new GetFeaturedToursQuery(50)).ShouldNotHaveAnyValidationErrors();
        new GetLatestToursQueryValidator().TestValidate(new GetLatestToursQuery(50)).ShouldNotHaveAnyValidationErrors();
        new GetTopAttractionsQueryValidator().TestValidate(new GetTopAttractionsQuery(50)).ShouldNotHaveAnyValidationErrors();
        new GetTrendingDestinationsQueryValidator().TestValidate(new GetTrendingDestinationsQuery(50)).ShouldNotHaveAnyValidationErrors();
    }
}
