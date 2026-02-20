using System.Diagnostics;
using Api.Infrastructure;
using Application.Common.Constant;
using Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;
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
        services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer((document, _, _) =>
            {
                document.Components ??= new OpenApiComponents();
                document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();

                document.Components.SecuritySchemes.Add("Bearer", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Name = "Authorization"
                });

                document.Security =
                [
                    new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecuritySchemeReference("Bearer"),
                            []
                        }
                    }
                ];

                document.SetReferenceHostDocument();

                return Task.CompletedTask;
            });
        });

        services.AddControllers();
        services.AddHttpContextAccessor();
        services.AddExceptionHandler<CustomExceptionHandler>();
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
                builder
                    .WithOrigins(configuration
                        .GetSection("Cors:AllowedOrigins")
                        .GetChildren()
                        .Select(x => x.Value ?? throw new ApplicationException("Origin url cannot be empty"))
                        .ToArray())
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials());
        });

        services.Configure<ApiBehaviorOptions>(options => options.SuppressModelStateInvalidFilter = true);

        services.AddMonitoringServices(configuration);
        services.AddIdentityServices();

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

        services.AddOpenTelemetry()
            .ConfigureResource(resource => resource.AddService(ServiceName))
            .UseOtlpExporter(OtlpExportProtocol.HttpProtobuf, new Uri(configuration["OpenTelemetry:Endpoint"]!))
            .WithTracing(tracing => tracing
                .AddHttpClientInstrumentation()
                .AddAspNetCoreInstrumentation())
            .WithMetrics(metrics => metrics
                .AddHttpClientInstrumentation()
                .AddAspNetCoreInstrumentation());

        return services;
    }

    private static IServiceCollection AddIdentityServices(this IServiceCollection services)
    {
        services.AddAuthorizationBuilder()
            .AddPolicy(Policies.EndpointAccess, policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.AddRequirements(new EndpointAccessRequirement());
            });

        services.AddSingleton<IAuthorizationHandler, EndpointAccessHandler>();
        services.AddSingleton<IAuthorizationMiddlewareResultHandler, CustomAuthorizationResultHandler>();

        services.AddSingleton<IUser, CurrentUser>();
        services.AddSingleton<IToken, CurrentToken>();

        return services;
    }
}