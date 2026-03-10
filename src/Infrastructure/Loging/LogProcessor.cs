using Domain.Constant;
using Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure.Loging;

internal class LogProcessor(LogQueue queue, IServiceScopeFactory scopeFactory) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var batch = new List<LogError>();

        while (!stoppingToken.IsCancellationRequested)
        {
            while (queue.Reader.TryRead(out var log))
            {
                batch.Add(log);
                if (batch.Count >= 50) break;
            }

            if (batch.Any())
            {
                using (var scope = scopeFactory.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    await db.Set<LogError>().AddRangeAsync(batch); 
                    await db.SaveChangesAsync(stoppingToken);
                }
                batch.Clear(); 
            }
            await Task.Delay(5000, stoppingToken);
        }
    }
}
