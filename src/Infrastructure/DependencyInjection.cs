using Contracts.Interfaces;
using Infrastructure.Data;
using Infrastructure.Files;
using Infrastructure.Identity;
using Infrastructure.Localization;
using Infrastructure.Loging;
using Infrastructure.Mails;
using Infrastructure.Repositories.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ZiggyCreatures.Caching.Fusion;
using ZiggyCreatures.Caching.Fusion.Serialization.SystemTextJson;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        return services
           .AddDbContext<AppDbContext>(options =>
            {
                options.UseLazyLoadingProxies(proxyOptions =>
                {
                    proxyOptions.IgnoreNonVirtualNavigations();
                });
                options.UseNpgsql(configuration.GetConnectionString("Default"), npgsqlOptions =>
                {
                    npgsqlOptions.CommandTimeout(120);
                    npgsqlOptions.EnableRetryOnFailure(3);
                });
            })
            .AddLogingService(configuration)           
            .AddIdentityServices(configuration)
            .AddMailService(configuration)
            .AddFileService(configuration)
            .AddCacheService(configuration)
            .AddScoped<ILanguageContext, LanguageContext>()
            .AddRepositories(configuration);
    }

    private static IServiceCollection AddCacheService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddFusionCache()
            .WithDefaultEntryOptions(new FusionCacheEntryOptions
            {
                Duration = TimeSpan.FromMinutes(5)
            })
            .WithSerializer(new FusionCacheSystemTextJsonSerializer())
            .WithRegisteredDistributedCache();

        services.AddStackExchangeRedisCache(options => options.Configuration = configuration["Redis:ConnectionString"]);

        return services;
    }
}
