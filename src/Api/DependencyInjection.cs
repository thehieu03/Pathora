using System.Diagnostics;
using System.IO.Compression;
using System.Text.Json;
using System.Threading.RateLimiting;
using Api.Configuration;
using Api.Infrastructure;
using Api.Swagger.Extensions;
using ApiExceptionHandler = Api.Exceptions.Handler.CustomExceptionHandler;
using Application.Common.Constant;
using Contracts.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SignalR;
using OpenTelemetry;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Enrichers.Span;
using Serilog.Sinks.OpenTelemetry;
using Serilog.Templates;
using Serilog.Templates.Themes;

namespace Api;

public static class DependencyInjection
{
    private const string ServiceName = "QLMM";

    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSwaggerServices(configuration);

        // Add case-insensitive JSON deserialization
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            });
        services.AddResponseCaching();
        services.AddSignalR();
        services.AddHttpContextAccessor();
        services.AddProblemDetails();
        services.AddExceptionHandler<ApiExceptionHandler>();
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
                builder
                    .WithOrigins(configuration
                        .GetSection("Cors:AllowedOrigins")
                        .GetChildren()
                        .Select(x => x.Value ?? throw new ApplicationException("Origin url cannot be empty"))
                        .ToArray())
                    .WithHeaders("Content-Type", "Authorization", "Accept", "Accept-Language", "X-Requested-With")
                    .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                    .AllowCredentials());
        });

        services.Configure<ApiBehaviorOptions>(options => options.SuppressModelStateInvalidFilter = true);

        services.AddMonitoringServices(configuration);
        services.AddIdentityServices(configuration);
        services.AddRateLimiterServices();
        services.AddResponseCompressionServices();
        services.AddSingleton<IDatabaseStartupLifecycle, EfCoreDatabaseStartupLifecycle>();
        services.AddSingleton<DatabaseStartupInitializer>();

        return services;
    }

    private static IServiceCollection AddResponseCompressionServices(this IServiceCollection services)
    {
        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
            options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
            [
                "application/json",
                "text/plain",
                "text/html"
            ]);
        });

        services.Configure<BrotliCompressionProviderOptions>(options =>
            options.Level = CompressionLevel.Fastest);

        services.Configure<GzipCompressionProviderOptions>(options =>
            options.Level = CompressionLevel.SmallestSize);

        return services;
    }

    private static IServiceCollection AddRateLimiterServices(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.AddPolicy("global", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 100,
                        Window = TimeSpan.FromMinutes(1),
                        QueueLimit = 0
                    }));

            options.AddPolicy("auth-strict", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 20,
                        Window = TimeSpan.FromMinutes(1),
                        QueueLimit = 0
                    }));

            options.OnRejected = async (context, cancellationToken) =>
            {
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                {
                    context.HttpContext.Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();
                }

                await Task.CompletedTask;
            };

            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 100,
                        Window = TimeSpan.FromMinutes(1),
                        QueueLimit = 0
                    }));
        });

        return services;
    }

    private static IServiceCollection AddMonitoringServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        using var listener = new ActivityListener();
        listener.ShouldListenTo = _ => true;
        listener.Sample = (ref _) => ActivitySamplingResult.AllData;
        ActivitySource.AddActivityListener(listener);
        var source = new ActivitySource("QLMM", "1.0.0");

        services.AddSerilog((serviceProvider, lc) => lc
            .ReadFrom.Configuration(configuration)
            .ReadFrom.Services(serviceProvider)
            .Enrich.FromLogContext()
            .Enrich.WithSpan()
            .WriteTo.Console(new ExpressionTemplate(
                "[{@t:HH:mm:ss} {@l:u3}{#if @tr is not null} ({substring(@tr,0,4)}:{substring(@sp,0,4)}){#end}] {@m}\n{@x}",
                theme: TemplateTheme.Code))
            .WriteTo.OpenTelemetry(opts =>
                {
                    opts.ResourceAttributes = new Dictionary<string, object>
                    {
                        ["service.name"] = ServiceName
                    };
                    opts.Endpoint = configuration["OpenTelemetry:Endpoint"]!;
                    opts.Protocol = OtlpProtocol.HttpProtobuf;
                },
                true));

        //services.AddOpenTelemetry()
        //    .ConfigureResource(resource => resource.AddService(ServiceName))
        //    .UseOtlpExporter(OtlpExportProtocol.HttpProtobuf, new Uri(configuration["OpenTelemetry:Endpoint"]!))
        //    .WithTracing(tracing => tracing
        //        .AddHttpClientInstrumentation()
        //        .AddAspNetCoreInstrumentation())
        //    .WithMetrics(metrics => metrics
        //        .AddHttpClientInstrumentation()
        //        .AddAspNetCoreInstrumentation());

        return services;
    }

    private static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
    {
        var isAuthDisabled = configuration.GetValue<bool>("Auth:DisableAuthorization");

        services.AddAuthorization(options =>
        {
            // When DisableAuthorization is true, allow unauthenticated access by default.
            // Individual endpoints with [Authorize] still require auth.
            // Endpoints with [AllowAnonymous] bypass auth regardless.
            options.FallbackPolicy = isAuthDisabled
                ? null
                : new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
            options.DefaultPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
        });

        services.AddSingleton<IUser, CurrentUser>();
        services.AddSingleton<IToken, CurrentToken>();

        return services;
    }
}
