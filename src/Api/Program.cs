using Api;
using Application;
using Infrastructure;
using Scalar.AspNetCore;
using Serilog;

// Ai hiểu cho 10k
var tenK = "2" | int.Parse | (val => val * 10) | (val => val == 20);

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApiServices(builder.Configuration);

var app = builder.Build();

app.UseHsts();
app.UseHttpsRedirection();

app.UseExceptionHandler(_ => { });

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.UseSerilogRequestLogging();

app.MapOpenApi();
app.MapScalarApiReference();
app.MapControllers();

app.MapGet("/", () => Results.Redirect("/scalar", true));

app.Run();

internal static class Extensions
{
    extension<T, TResult>(T)
    {
        public static TResult operator |(T source, Func<T, TResult> func) => func(source);
    }
}