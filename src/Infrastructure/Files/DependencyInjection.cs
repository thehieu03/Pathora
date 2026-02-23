using Application.Common.Interfaces;
using System.Net;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Files;

public static class DependencyInjection
{
    internal static IServiceCollection AddFileService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IFileManager, FileManager>();
        services.AddScoped<IMinIOCloudService, MinIOCloudService>();
        services.AddHttpClient<ISeaweedClient, SeaweedClient>(client =>
            {
                client.BaseAddress = new Uri(configuration["Seaweed:Url"] ??
                                             throw new InvalidOperationException("Invalid Seaweed URL"));
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            })
            .ConfigurePrimaryHttpMessageHandler(() =>
                new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback =
                        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator,
                    CookieContainer = new CookieContainer()
                }
            );
        return services;
    }
}