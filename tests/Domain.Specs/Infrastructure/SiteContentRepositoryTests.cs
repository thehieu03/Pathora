using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Domain.Specs.Infrastructure;

public sealed class SiteContentRepositoryTests
{
    [Fact]
    public async Task GetAdminListAsync_WhenFiltersProvided_ShouldReturnFilteredOrderedRows()
    {
        await using var context = CreateContext();
        context.SiteContents.AddRange(
            SiteContentEntity.Create("about", "values", "{\"title\":\"A\"}", "seed"),
            SiteContentEntity.Create("policies", "policy-sections", "{\"title\":\"P\"}", "seed"),
            SiteContentEntity.Create("about", "team-members", "{\"title\":\"T\"}", "seed"));
        await context.SaveChangesAsync();

        var repository = new SiteContentRepository(context);

        var rows = await repository.GetAdminListAsync("about", "team");

        var row = Assert.Single(rows);
        Assert.Equal("about", row.PageKey);
        Assert.Equal("team-members", row.ContentKey);
    }

    [Fact]
    public async Task UpsertByIdAsync_WhenEntityExists_ShouldUpdateAndPersist()
    {
        await using var context = CreateContext();
        var entity = SiteContentEntity.Create("about", "team-members", "{\"title\":\"Old\"}", "seed");
        await context.SiteContents.AddAsync(entity);
        await context.SaveChangesAsync();

        var repository = new SiteContentRepository(context);

        var result = await repository.UpsertByIdAsync(entity.Id, "{\"title\":\"New\"}", "admin-user");

        Assert.False(result.IsError);
        Assert.Equal("{\"title\":\"New\"}", result.Value.ContentValue);
        Assert.Equal("admin-user", result.Value.LastModifiedBy);
    }

    [Fact]
    public async Task UpsertByIdAsync_WhenEntityMissing_ShouldReturnNotFoundError()
    {
        await using var context = CreateContext();
        var repository = new SiteContentRepository(context);

        var result = await repository.UpsertByIdAsync(Guid.CreateVersion7(), "{\"title\":\"New\"}", "admin-user");

        Assert.True(result.IsError);
        Assert.Equal("SiteContent.NotFound", result.FirstError.Code);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"site-content-repo-{Guid.NewGuid():N}")
            .Options;

        return new AppDbContext(options);
    }
}
