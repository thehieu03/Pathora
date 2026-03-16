using Api.Endpoint;
using Application.Services;
using Domain.ApiThirdPatyResponse;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route(SepayWebhookEndpoint.Base)]
[ApiController]
public class SepayWebhookController : ControllerBase
{
    private const string NoTransactionsToProcessMessage = "No transactions to process";
    private const string HealthyStatus = "healthy";
    private const string DefaultAmountLiteral = "0";

    private readonly IPaymentService _paymentService;
    private readonly ILogger<SepayWebhookController> _logger;

    public SepayWebhookController(IPaymentService paymentService, ILogger<SepayWebhookController> logger)
    {
        _paymentService = paymentService;
        _logger = logger;
    }

    /// <summary>
    /// Webhook endpoint nhận callback từ Sepay khi có giao dịch chuyển khoản
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> ReceiveCallback([FromBody] SepayApiResponse callbackData)
    {
        _logger.LogInformation("Received Sepay webhook callback: {Status}", callbackData.Status);

        if (callbackData.Transactions == null || !callbackData.Transactions.Any())
        {
            _logger.LogWarning("Sepay webhook received but no transactions found");
            return Ok(new { success = true, message = NoTransactionsToProcessMessage });
        }

        var results = new List<object>();

        foreach (var transaction in callbackData.Transactions)
        {
            try
            {
                var transactionData = new SepayTransactionData
                {
                    TransactionId = transaction.id ?? Guid.NewGuid().ToString(),
                    BankBrandName = transaction.bank_brand_name,
                    AccountNumber = transaction.account_number,
                    TransactionDate = ParseTransactionDate(transaction.transaction_date),
                    Amount = ParseAmount(transaction.amount_in ?? transaction.amount_out ?? DefaultAmountLiteral),
                    TransactionContent = transaction.transaction_content,
                    ReferenceNumber = transaction.reference_number
                };

                var result = await _paymentService.ProcessPaymentCallbackAsync(transactionData);

                if (result.IsError)
                {
                    _logger.LogWarning("Failed to process transaction {TransactionId}: {Error}",
                        transactionData.TransactionId, result.Errors);
                    results.Add(new
                    {
                        transactionId = transactionData.TransactionId,
                        success = false,
                        errors = result.Errors.Select(e => new { code = e.Code, description = e.Description })
                    });
                }
                else
                {
                    _logger.LogInformation("Successfully processed transaction {TransactionCode}, amount: {Amount}",
                        result.Value.TransactionCode, result.Value.PaidAmount);
                    results.Add(new
                    {
                        transactionId = transactionData.TransactionId,
                        success = true,
                        transactionCode = result.Value.TransactionCode,
                        amount = result.Value.PaidAmount
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing transaction {TransactionId}", transaction.id);
                results.Add(new
                {
                    transactionId = transaction.id,
                    success = false,
                    error = ex.Message
                });
            }
        }

        return Ok(new { success = true, results });
    }

    /// <summary>
    /// Endpoint kiểm tra trạng thái webhook (health check)
    /// </summary>
    [HttpGet(SepayWebhookEndpoint.Health)]
    public IActionResult HealthCheck()
    {
        return Ok(new { status = HealthyStatus, timestamp = DateTimeOffset.UtcNow });
    }

    private static DateTimeOffset ParseTransactionDate(string? dateStr)
    {
        if (string.IsNullOrEmpty(dateStr))
            return DateTimeOffset.UtcNow;

        // Sepay format: "2024-03-15 10:30:00"
        if (DateTimeOffset.TryParse(dateStr, out var parsed))
            return parsed;

        return DateTimeOffset.UtcNow;
    }

    private static decimal ParseAmount(string? amountStr)
    {
        if (string.IsNullOrEmpty(amountStr))
            return decimal.Zero;

        // Remove any formatting and parse
        var cleaned = amountStr.Replace(",", "").Replace(".", "").Trim();
        if (decimal.TryParse(cleaned, out var amount))
            return amount;

        return decimal.Zero;
    }
}
