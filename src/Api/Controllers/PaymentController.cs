using Api.Endpoint;
using Application.Contracts.Payment;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Api.Controllers;

[Microsoft.AspNetCore.Components.Route(AuthEndpoint.Base)]
public class PaymentController : BaseApiController
{
    [HttpPost(PaymentEndpoint.GetQR)]
    public async Task<IActionResult> CreateQR(GetQRCommand command)
    {
        var result = await Sender.Send(command);
        return HandleCreated(result);
    }
    [HttpPost(PaymentEndpoint.CheckTransaction)]
    public async Task<IActionResult> CheckTransaction([FromBody] object test)
    {
        try
        {
            string content = JsonSerializer.Serialize(test, new JsonSerializerOptions { WriteIndented = true });

            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "transactions_log.txt");

            string logEntry = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] - Data: {content}{Environment.NewLine}{new string('-', 30)}{Environment.NewLine}";

            await System.IO.File.AppendAllTextAsync(filePath, logEntry);

            return Ok(new { message = "Ghi file thành công!", path = filePath });
        }
        catch (Exception ex)
        {
            return BadRequest($"Lỗi ghi file: {ex.Message}");
        }
    }
}
