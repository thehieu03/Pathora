using Infrastructure.Data;
using Infrastructure.Data.Seed;
using Serilog;

namespace Api.Middleware;

public sealed class DatabaseAutoSeedMiddleware(RequestDelegate next)
{
    private static readonly SemaphoreSlim SeedGate = new(1, 1);
    private static volatile bool _seedChecked;

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        if (!_seedChecked)
        {
            await SeedGate.WaitAsync();
            try
            {
                if (!_seedChecked)
                {
                    var seeded = await AppDbContextSeed.SeedIfNeededAsync(dbContext);
                    if (seeded)
                    {
                        Log.Information("Initial seed data has been inserted because database was empty.");
                    }

                    _seedChecked = true;
                }
            }
            finally
            {
                SeedGate.Release();
            }
        }

        await next(context);
    }
}
