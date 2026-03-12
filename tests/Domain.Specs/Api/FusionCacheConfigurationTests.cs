using Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ZiggyCreatures.Caching.Fusion;

namespace Domain.Specs.Api;

public sealed class FusionCacheConfigurationTests
{
    [Fact]
    public void AddInfrastructureServices_WhenRedisConfigured_ShouldResolveFusionCache()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:Default"] = "Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=postgres",
                ["Redis:ConnectionString"] = "localhost:6379",
                ["Jwt:Secret"] = "QWERTYUIOP12349876AASDFGHJKLMNBVCXZQWERTYUIOP12349876AASDFGHJKLMNBVCXZ",
                ["Jwt:Issuer"] = "http://localhost:8080",
                ["Jwt:Audience"] = "http://localhost:8080",
                ["MinIO:Endpoint"] = "localhost:9000",
                ["MinIO:AccessKey"] = "minioadmin",
                ["MinIO:SecretKey"] = "minioadmin123"
            })
            .Build();

        var services = new ServiceCollection();
        services.AddInfrastructureServices(configuration);

        using var provider = services.BuildServiceProvider();

        var exception = Record.Exception(() => provider.GetRequiredService<IFusionCache>());

        Assert.Null(exception);
    }
}
