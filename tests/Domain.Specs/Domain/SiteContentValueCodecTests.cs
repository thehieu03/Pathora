using System.Text.Json;
using Domain.Entities;

namespace Domain.Specs.Domain;

public sealed class SiteContentValueCodecTests
{
    [Fact]
    public void ResolveContentElement_WhenLegacyPayload_ShouldReturnLegacyValue()
    {
        const string contentValue = "{\"title\":\"Legacy\",\"items\":[1,2]}";

        var resolved = SiteContentValueCodec.ResolveContentElement(contentValue, "vi");

        Assert.Equal("Legacy", resolved.GetProperty("title").GetString());
        Assert.Equal(2, resolved.GetProperty("items").GetArrayLength());
    }

    [Fact]
    public void ResolveContentElement_WhenLocalizedPayloadAndRequestedLocaleExists_ShouldReturnRequestedLocalePayload()
    {
        const string contentValue = "{\"en\":{\"headline\":\"Welcome\"},\"vi\":{\"headline\":\"Xin chao\"}}";

        var resolved = SiteContentValueCodec.ResolveContentElement(contentValue, "vi");

        Assert.Equal("Xin chao", resolved.GetProperty("headline").GetString());
    }

    [Fact]
    public void ResolveContentElement_WhenRequestedLocaleMissing_ShouldFallbackToEnglish()
    {
        const string contentValue = "{\"en\":{\"headline\":\"Welcome\"}}";

        var resolved = SiteContentValueCodec.ResolveContentElement(contentValue, "fr");

        Assert.Equal("Welcome", resolved.GetProperty("headline").GetString());
    }

    [Fact]
    public void ResolveContentElement_WhenPayloadIsLegacyAndLocaleMissing_ShouldFallbackToLegacyPayload()
    {
        const string contentValue = "[{\"title\":\"Legacy item\"}]";

        var resolved = SiteContentValueCodec.ResolveContentElement(contentValue, "fr");

        Assert.Equal(JsonValueKind.Array, resolved.ValueKind);
        Assert.Equal("Legacy item", resolved[0].GetProperty("title").GetString());
    }

    [Fact]
    public void GetMetadata_WhenPayloadLocalized_ShouldIdentifyAvailableLocales()
    {
        const string contentValue = "{\"en\":{\"title\":\"Welcome\"},\"vi\":{\"title\":\"Xin chao\"}}";

        var metadata = SiteContentValueCodec.GetMetadata(contentValue);

        Assert.True(metadata.IsLocalized);
        Assert.True(metadata.HasEnglish);
        Assert.True(metadata.HasVietnamese);
    }

    [Fact]
    public void GetEditableValues_WhenPayloadIsLegacy_ShouldUseLegacyPayloadForBothLocales()
    {
        const string contentValue = "{\"title\":\"Legacy\"}";

        var editable = SiteContentValueCodec.GetEditableValues(contentValue);

        Assert.False(editable.IsLocalized);
        Assert.Equal(contentValue, editable.EnglishContentValue);
        Assert.Equal(contentValue, editable.VietnameseContentValue);
    }

    [Fact]
    public void TryCreateLocalizedContentValue_WhenVietnameseJsonInvalid_ShouldReturnValidationError()
    {
        const string englishJson = "{\"title\":\"Welcome\"}";
        const string vietnameseJson = "{\"title\":\"Xin chao\"";

        var success = SiteContentValueCodec.TryCreateLocalizedContentValue(
            englishJson,
            vietnameseJson,
            out _,
            out var error);

        Assert.False(success);
        Assert.Equal("vietnameseContentValue must be valid JSON", error);
    }

    [Fact]
    public void TryCreateLocalizedContentValue_WhenInputsValid_ShouldCreateCanonicalLocalizedPayload()
    {
        const string englishJson = "{\"title\":\"Welcome\"}";
        const string vietnameseJson = "{\"title\":\"Xin chao\"}";

        var success = SiteContentValueCodec.TryCreateLocalizedContentValue(
            englishJson,
            vietnameseJson,
            out var localizedContent,
            out var error);

        Assert.True(success);
        Assert.Null(error);

        using var document = JsonDocument.Parse(localizedContent);
        Assert.Equal("Welcome", document.RootElement.GetProperty("en").GetProperty("title").GetString());
        Assert.Equal("Xin chao", document.RootElement.GetProperty("vi").GetProperty("title").GetString());
    }
}
