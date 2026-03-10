using Application.Common.Interfaces;
using Infrastructure.Loging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Minio;
using System.Net;
using System.Net.Http.Headers;

namespace Infrastructure.Loging;

public static class DependencyInjection
{
    internal static IServiceCollection AddLogingService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<LogQueue>();
        services.AddHostedService<LogProcessor>();
        return services;
    }
}
