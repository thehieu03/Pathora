using System.Security.Claims;
using System.Text.Json;
using Api.Controllers;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

namespace Domain.Specs.Api;

public sealed class SiteContentControllerTests
{
    [Fact]
    public async Task GetByPage_WhenLocalizedContentExists_ShouldReturnLanguageResolvedValues()
    {
        var repository = Substitute.For<ISiteContentRepository>();
        repository.GetByPageKeyAsync("about").Returns(
        [
            SiteContentEntity.Create(
                "about",
                "hero",
                "{\"en\":{\"headline\":\"Welcome\"},\"vi\":{\"headline\":\"Xin chao\"}}",
                "seed")
        ]);

        var controller = BuildController(repository);

        var actionResult = await controller.GetByPage("about", new TestLanguageContext("vi"));

        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var payload = ToJsonElement(okResult.Value);
        Assert.Equal("Xin chao", payload.GetProperty("items").GetProperty("hero").GetProperty("headline").GetString());
    }

    [Fact]
    public async Task GetAdminList_WhenRowsExist_ShouldReturnMetadataForTable()
    {
        var repository = Substitute.For<ISiteContentRepository>();
        repository.GetAdminListAsync("about", "hero").Returns(
        [
            SiteContentEntity.Create(
                "about",
                "hero",
                "{\"en\":{\"headline\":\"Welcome\"},\"vi\":{\"headline\":\"Xin chao\"}}",
                "seed")
        ]);

        var controller = BuildController(repository);

        var actionResult = await controller.GetAdminList("about", "hero");

        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var payload = ToJsonElement(okResult.Value);
        var row = payload.GetProperty("items")[0];

        Assert.Equal("about", row.GetProperty("pageKey").GetString());
        Assert.Equal("hero", row.GetProperty("contentKey").GetString());
        Assert.True(row.GetProperty("hasEnglish").GetBoolean());
        Assert.True(row.GetProperty("hasVietnamese").GetBoolean());
        Assert.True(row.GetProperty("isLocalized").GetBoolean());
    }

    [Fact]
    public async Task GetAdminById_WhenRecordMissing_ShouldReturnNotFound()
    {
        var repository = Substitute.For<ISiteContentRepository>();
        repository.GetByIdAsync(Arg.Any<Guid>()).Returns((SiteContentEntity?)null);

        var controller = BuildController(repository);

        var actionResult = await controller.GetAdminById(Guid.CreateVersion7());

        var notFound = Assert.IsType<NotFoundObjectResult>(actionResult);
        var payload = ToJsonElement(notFound.Value);
        Assert.Equal("Content not found", payload.GetProperty("error").GetString());
    }

    [Fact]
    public async Task Upsert_WhenLocalizedPayloadInvalid_ShouldReturnBadRequest()
    {
        var repository = Substitute.For<ISiteContentRepository>();
        var controller = BuildController(repository);

        var actionResult = await controller.Upsert(
            "about",
            "hero",
            new UpsertSiteContentRequest(null, "{\"headline\":\"Welcome\"", "{\"headline\":\"Xin chao\"}"));

        var badRequest = Assert.IsType<BadRequestObjectResult>(actionResult);
        var payload = ToJsonElement(badRequest.Value);
        Assert.Equal("englishContentValue must be valid JSON", payload.GetProperty("error").GetString());

        await repository.DidNotReceiveWithAnyArgs().UpsertAsync(default!, default!, default!, default!);
    }

    [Fact]
    public async Task UpsertById_WhenLocalizedPayloadValid_ShouldPersistCanonicalLocalizedPayload()
    {
        var repository = Substitute.For<ISiteContentRepository>();
        var id = Guid.CreateVersion7();
        repository.UpsertByIdAsync(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>())
            .Returns(callInfo =>
            {
                var entity = SiteContentEntity.Create("about", "hero", callInfo.ArgAt<string>(1), "seed");
                entity.Id = callInfo.ArgAt<Guid>(0);
                return entity;
            });

        var controller = BuildController(repository);

        var actionResult = await controller.UpsertById(
            id,
            new UpdateAdminSiteContentRequest("{\"headline\":\"Welcome\"}", "{\"headline\":\"Xin chao\"}"));

        var ok = Assert.IsType<OkObjectResult>(actionResult);
        _ = Assert.IsType<SiteContentEntity>(ok.Value);

        await repository.Received(1).UpsertByIdAsync(
            id,
            Arg.Is<string>(value =>
                value.Contains("\"en\"", StringComparison.Ordinal) &&
                value.Contains("\"vi\"", StringComparison.Ordinal)),
            Arg.Any<string>());
    }

    private static SiteContentController BuildController(ISiteContentRepository repository)
    {
        var controller = new SiteContentController(repository, NullLogger<SiteContentController>.Instance)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(
                        new ClaimsIdentity(
                        [
                            new Claim(ClaimTypes.NameIdentifier, "admin-user")
                        ],
                        "TestAuth"))
                }
            }
        };

        return controller;
    }

    private static JsonElement ToJsonElement(object? value)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        using var document = JsonDocument.Parse(JsonSerializer.Serialize(value, options));
        return document.RootElement.Clone();
    }

    private sealed class TestLanguageContext(string language) : ILanguageContext
    {
        public string CurrentLanguage { get; set; } = language;
    }
}
