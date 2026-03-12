using Application.Features.Public.Queries;
using Contracts.Interfaces;

namespace Domain.Specs.Application;

public sealed class GetPublicTourDetailQueryCacheKeyTests
{
    [Fact]
    public void CacheKey_WhenLanguageDiffers_ShouldGenerateDifferentKeys()
    {
        var id = Guid.CreateVersion7();

        var viQuery = new GetPublicTourDetailQuery(id, "vi-VN");
        var enQuery = new GetPublicTourDetailQuery(id, "en-US");

        Assert.NotEqual(viQuery.CacheKey, enQuery.CacheKey);
        Assert.EndsWith(":vi", viQuery.CacheKey, StringComparison.Ordinal);
        Assert.EndsWith(":en", enQuery.CacheKey, StringComparison.Ordinal);
    }

    [Fact]
    public void CacheKey_WhenLanguageIsUnsupported_ShouldFallbackToDefaultLanguage()
    {
        var id = Guid.CreateVersion7();
        var query = new GetPublicTourDetailQuery(id, "fr-FR");

        Assert.EndsWith($":{ILanguageContext.DefaultLanguage}", query.CacheKey, StringComparison.Ordinal);
    }
}
