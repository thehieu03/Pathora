using Application.Features.Public.Queries;
using Contracts.Interfaces;

namespace Domain.Specs.Application;

public sealed class PublicQueryCacheKeyLanguageTests
{
    [Fact]
    public void GetLatestToursQuery_CacheKey_ShouldContainNormalizedLanguage()
    {
        AssertLanguageAwareCacheKey(language => new GetLatestToursQuery(6, language));
    }

    [Fact]
    public void GetFeaturedToursQuery_CacheKey_ShouldContainNormalizedLanguage()
    {
        AssertLanguageAwareCacheKey(language => new GetFeaturedToursQuery(8, language));
    }

    [Fact]
    public void GetTrendingDestinationsQuery_CacheKey_ShouldContainNormalizedLanguage()
    {
        AssertLanguageAwareCacheKey(language => new GetTrendingDestinationsQuery(6, language));
    }

    [Fact]
    public void GetTopAttractionsQuery_CacheKey_ShouldContainNormalizedLanguage()
    {
        AssertLanguageAwareCacheKey(language => new GetTopAttractionsQuery(8, language));
    }

    [Fact]
    public void GetHomeStatsQuery_CacheKey_ShouldContainNormalizedLanguage()
    {
        AssertLanguageAwareCacheKey(language => new GetHomeStatsQuery(language));
    }

    [Fact]
    public void GetPublicTourInstancesQuery_CacheKey_ShouldContainNormalizedLanguage()
    {
        AssertLanguageAwareCacheKey(language => new GetPublicTourInstancesQuery("ha long", 1, 10, language));
    }

    [Fact]
    public void GetPublicTourInstanceDetailQuery_CacheKey_ShouldContainNormalizedLanguage()
    {
        var id = Guid.CreateVersion7();
        AssertLanguageAwareCacheKey(language => new GetPublicTourInstanceDetailQuery(id, language));
    }

    [Fact]
    public void SearchToursQuery_CacheKey_ShouldContainNormalizedLanguage()
    {
        AssertLanguageAwareCacheKey(language =>
            new SearchToursQuery(null, null, null, null, null, null, null, null, null, 1, 10, language));
    }

    private static void AssertLanguageAwareCacheKey(Func<string?, ICacheable> queryFactory)
    {
        var viQuery = queryFactory("vi-VN");
        var enQuery = queryFactory("en-US,en;q=0.9");
        var unsupportedQuery = queryFactory("fr-FR");

        Assert.NotEqual(viQuery.CacheKey, enQuery.CacheKey);
        Assert.EndsWith(":vi", viQuery.CacheKey, StringComparison.Ordinal);
        Assert.EndsWith(":en", enQuery.CacheKey, StringComparison.Ordinal);
        Assert.EndsWith($":{ILanguageContext.DefaultLanguage}", unsupportedQuery.CacheKey, StringComparison.Ordinal);
    }
}
