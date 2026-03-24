using Api;
using Api.Middleware;
using Api.Configuration;
using Api.Swagger.Extensions;
using Api.Services;
using Application;
using Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApiServices(builder.Configuration);

// Configure outbox worker
builder.Services.Configure<OutboxWorkerOptions>(builder.Configuration.GetSection("OutboxWorker"));
builder.Services.AddSingleton<OutboxWorkerOptions>(sp => sp.GetRequiredService<IOptions<OutboxWorkerOptions>>().Value);
builder.Services.AddHostedService<OutboxWorkerService>();

builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy("API is running"))
    .AddCheck<DatabaseHealthCheck>("database")
    .AddCheck<MinIOHealthCheck>("minio");

// Initialize MinIO buckets at startup
builder.Services.AddHostedService<MinIOBucketInitializer>();
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins ?? Array.Empty<string>())
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
var app = builder.Build();

await app.Services.GetRequiredService<DatabaseStartupInitializer>().InitializeAsync();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
//    app.UseHttpsRedirection();
}

// Authentication and Authorization must be before exception handling
// so that auth challenges (401/403) can set status codes before any response body is written.
app.UseCors("DefaultCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var ex = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
        await context.Response.WriteAsJsonAsync(new
        {
            error = ex?.GetType().Name,
            message = ex?.Message,
            stack = ex?.StackTrace
        });
    });
});

app.UseResponseCompression();

app.UseResponseCaching();

app.UseMiddleware<LanguageResolutionMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();

app.UseRateLimiter();

app.UseSerilogRequestLogging();

app.UseSwaggerApi();

app.MapHealthChecks("/health");
app.MapHealthChecks("/health/live", new()
{
    Predicate = check => check.Name == "self"
});
app.MapHealthChecks("/health/ready", new()
{
    Predicate = check => check.Name == "database" || check.Name == "minio"
});

app.MapControllers();

// Map SignalR hubs
app.MapHub<Api.Hubs.NotificationsHub>("/hubs/notifications");

app.Run();

internal static class Extensions
{
    extension<T, TResult>(T)
    {
        public static TResult operator |(T source, Func<T, TResult> func) => func(source);
    }
}
