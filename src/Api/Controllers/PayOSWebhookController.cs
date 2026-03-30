using Microsoft.AspNetCore.Mvc;

using Api.Endpoint;
using Application.Services;
using Domain.ApiThirdPatyResponse;
using Domain.Enums;

namespace Api.Controllers;

[Route(PayOSWebhookEndpoint.Base)]
[ApiController]
public class PayOSWebhookController : ControllerBase
{
    private readonly IPayOSClient _payOSClient;
    private readonly IPaymentService _paymentService;
    private readonly ILogger<PayOSWebhookController> _logger;

    public PayOSWebhookController(
        IPayOSClient payOSClient,
        IPaymentService paymentService,
        ILogger<PayOSWebhookController> logger)
    {
        _payOSClient = payOSClient;
        _paymentService = paymentService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> ReceiveWebhook()
    {
        // 1.3 Extract x-signature header and raw body
        if (!Request.Headers.TryGetValue("x-signature", out var signatureHeader))
        {
            _logger.LogWarning("PayOS webhook received without x-signature header");
            return StatusCode(403, new { error = "Invalid signature" });
        }

        var signature = signatureHeader.ToString();

        Request.EnableBuffering();
        using var reader = new StreamReader(Request.Body, leaveOpen: true);
        var rawBody = await reader.ReadToEndAsync();

        if (string.IsNullOrWhiteSpace(rawBody))
        {
            _logger.LogWarning("PayOS webhook received with empty body");
            return BadRequest(new { error = "Malformed request body" });
        }

        // 1.4 Call VerifyWebhookSignature — return 403 if invalid
        if (!_payOSClient.VerifyWebhookSignature(signature, rawBody))
        {
            _logger.LogWarning("PayOS webhook signature verification failed");
            return StatusCode(403, new { error = "Invalid signature" });
        }

        // 1.5 Parse JSON body into PayOSWebhookPayload DTO
        PayOSWebhookPayload? payload;
        try
        {
            payload = System.Text.Json.JsonSerializer.Deserialize<PayOSWebhookPayload>(
                rawBody,
                new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (System.Text.Json.JsonException ex)
        {
            _logger.LogWarning(ex, "PayOS webhook received with malformed JSON body");
            return BadRequest(new { error = "Malformed request body" });
        }

        if (payload == null)
        {
            _logger.LogWarning("PayOS webhook received with null payload");
            return BadRequest(new { error = "Malformed request body" });
        }

        _logger.LogInformation(
            "PayOS webhook received: orderCode={OrderCode}, amount={Amount}, status={Status}",
            payload.OrderCode, payload.Amount, payload.Status);

        // 1.6 Map PayOS status to TransactionStatus
        var normalizedStatus = payload.Status?.ToUpperInvariant() switch
        {
            "PAID" or "00" => (TransactionStatus?)TransactionStatus.Completed,
            "CANCELLED" => (TransactionStatus?)TransactionStatus.Cancelled,
            "EXPIRED" => (TransactionStatus?)TransactionStatus.Failed,
            _ => null
        };

        // Unknown status — acknowledge but skip processing
        if (normalizedStatus == null)
        {
            _logger.LogInformation(
                "PayOS webhook for orderCode={OrderCode} has unhandled status={Status}, acknowledging",
                payload.OrderCode, payload.Status);
            return Ok(new { success = true });
        }

        // 1.8 Call PaymentService.ProcessPayOSCallbackAsync
        var result = await _paymentService.ProcessPayOSCallbackAsync(
            orderCode: payload.OrderCode.ToString(),
            amount: payload.Amount,
            status: normalizedStatus.Value,
            transactionDate: (payload.TransactionDateTime ?? DateTimeOffset.UtcNow).ToUniversalTime());

        if (result.IsError)
        {
            _logger.LogWarning(
                "PayOS callback processing failed for orderCode={OrderCode}: {Errors}",
                payload.OrderCode, result.Errors);
            // Return 200 per spec: "Transaction not found → 200 (log error, PayOS will retry)"
            return Ok(new { success = true });
        }

        // 1.9 Return HTTP 200 OK
        _logger.LogInformation(
            "PayOS webhook processed successfully: orderCode={OrderCode}, status={Status}",
            payload.OrderCode, normalizedStatus);

        return Ok(new { success = true });
    }
}
