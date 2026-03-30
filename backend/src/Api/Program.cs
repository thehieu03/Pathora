using Api;
using Api.Middleware;
using Api.Configuration;
using Api.Services;
using Api.Swagger.Extensions;
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
    .AddCheck<DatabaseHealthCheck>("database");
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

// Note: DeveloperExceptionPage is intentionally NOT used in any environment.
// In Development, ASP.NET Core auto-registers it unless we suppress it. We handle all
// exceptions via custom middleware + IExceptionHandler registered in DI.
app.Environment.IsDevelopment(); // Suppress auto-UseDeveloperExceptionPage

// === TEMPORARY DIAGNOSTIC MIDDLEWARE FOR GOOGLE OAUTH 500 INVESTIGATION ===
// TODO: Remove after diagnosis (B.4)
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? "";
    var hasStartedBefore = context.Response.HasStarted;
    Console.WriteLine($"[DIAG] >>> {context.Request.Method} {path} — HasStarted BEFORE pipeline: {hasStartedBefore}");
    try
    {
        await next(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DIAG] !!! EXCEPTION: {ex.GetType().Name}: {ex.Message}");
        throw;
    }
    finally
    {
        Console.WriteLine($"[DIAG] <<< {context.Request.Method} {path} — HasStarted AFTER pipeline: {context.Response.HasStarted}, Status: {context.Response.StatusCode}");
    }
});
// === END TEMPORARY DIAGNOSTIC ===

// Exception handling middleware is FIRST to wrap the entire pipeline, including
// authentication/authorization middleware where "StatusCode cannot be set" exceptions
// can be thrown from JwtBearerHandler.HandleChallengeAsync.
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Authentication and Authorization.
app.UseCors("DefaultCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

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
    Predicate = check => check.Name == "database"
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
