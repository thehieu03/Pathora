using Api;
using Api.Middleware;
using Api.Configuration;
using Api.Swagger.Extensions;
using Application;
using Infrastructure;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
var disableAuthorization = builder.Configuration.IsAuthorizationDisabled();
builder.Logging.ClearProviders();
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApiServices(builder.Configuration);
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy("API is running"))
    .AddCheck<DatabaseHealthCheck>("database");

var app = builder.Build();

// NOTE: Auto migration/seed disabled for existing database environments.
//await using (var scope = app.Services.CreateAsyncScope())
//{
//    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//    await dbContext.Database.MigrateAsync();
//    await AppDbContextSeed.SeedIfNeededAsync(dbContext);
//}

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseExceptionHandler(_ => { });

app.UseResponseCompression();

app.UseMiddleware<SecurityHeadersMiddleware>();
//app.UseMiddleware<DatabaseAutoSeedMiddleware>();

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

app.Run();

internal static class Extensions
{
    extension<T, TResult>(T)
    {
        public static TResult operator |(T source, Func<T, TResult> func) => func(source);
    }
}
