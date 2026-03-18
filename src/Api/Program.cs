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
var disableAuthorization = builder.Configuration.IsAuthorizationDisabled();
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
    .AddCheck<DatabaseHealthCheck>("database");

var app = builder.Build();

await app.Services.GetRequiredService<DatabaseStartupInitializer>().InitializeAsync();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseExceptionHandler(_ => { });

app.UseResponseCompression();

app.UseResponseCaching();

app.UseMiddleware<SecurityHeadersMiddleware>();

app.UseCors();
app.UseMiddleware<LanguageResolutionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

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
    Predicate = check => check.Name == "database"
});

var controllerEndpoints = app.MapControllers();
if (disableAuthorization)
{
    controllerEndpoints.AllowAnonymous();
    Log.Warning("Authorization is disabled via configuration key Auth:DisableAuthorization");
}

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
