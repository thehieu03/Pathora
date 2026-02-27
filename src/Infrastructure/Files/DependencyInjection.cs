using Application.Common.Interfaces;
using System.Net;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Minio;

namespace Infrastructure.Files;

public static class DependencyInjection
{
    internal static IServiceCollection AddFileService(this IServiceCollection services, IConfiguration configuration)
    {
        services
            //.AddMinio(configureClient => configureClient
            //.WithEndpoint(configuration["MinIO:Endpoint"] ?? "localhost:9000")
            //.WithCredentials(
            //    configuration["MinIO:AccessKey"] ?? "minioadmin",
            //    configuration["MinIO:SecretKey"] ?? "minioadmin123")
            //.WithSSL(bool.TryParse(configuration["MinIO:UseSSL"], out var useSsl) && useSsl)
            //.Build());
            .AddMinio(configureClient =>
            {
                var endpoint = configuration["MinIO:Endpoint"];
                var accessKey = configuration["MinIO:AccessKey"];
                var secretKey = configuration["MinIO:SecretKey"];

                if (string.IsNullOrWhiteSpace(accessKey) ||
                    string.IsNullOrWhiteSpace(secretKey))
                {
                    throw new Exception("MinIO AccessKey/SecretKey is missing");
                }

                configureClient
                    .WithEndpoint(endpoint)
                    .WithCredentials(accessKey, secretKey)
                    .WithSSL(false)
                    .Build();
            });

        services.AddScoped<IFileManager, FileManager>();
        services.AddScoped<IMinIOCloudService, MinIOCloudService>();
        services.AddHttpClient<ISeaweedClient, SeaweedClient>(client =>
            {
                var seaweedUrl = configuration["Seaweed:Url"];
                if (!string.IsNullOrEmpty(seaweedUrl))
                {
                    client.BaseAddress = new Uri(seaweedUrl);
                }
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
