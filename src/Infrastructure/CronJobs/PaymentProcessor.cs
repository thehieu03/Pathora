using Application.Contracts.Payment;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

namespace Infrastructure.CronJobs;

internal class PaymentProcessor(IServiceScopeFactory scopeFactory) : BackgroundService
{
    private readonly HttpClient _httpClient = new();
    private readonly IServiceScopeFactory? _scopeFactory;
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer DEU74RNAROTL0XLKZF7GKOAONZBC2MRCWHU1DVMI0NFSEW8JSYY3PHXM9TCWZGSO");
        while (!stoppingToken.IsCancellationRequested)
        {
            string url = "https://my.sepay.vn/userapi/transactions/list?account_number=0378175727&limit=20";
            try
            {
                var response = await _httpClient.GetAsync(url, stoppingToken);
                response.EnsureSuccessStatusCode();
                string json = await response.Content.ReadAsStringAsync(stoppingToken);

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var transactions = JsonSerializer.Deserialize<SepayApiResponse>(json, options);
                using var scope = scopeFactory.CreateScope();
                var sender = scope.ServiceProvider.GetRequiredService<ISender>();
                await sender.Send(new ProcessPaymentCommand(transactions), stoppingToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching transactions: {ex.Message}");
                throw;
            }
        }
    }
}
    
