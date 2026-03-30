using System.Text;
using System.Text.Json;
using Api.Controllers;
using Application.Services;
using Domain.ApiThirdPatyResponse;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSubstitute;

namespace Domain.Specs.Api;

public sealed class SepayWebhookControllerTests
{
    private readonly IPaymentReconciliationService _reconciliationService =
        Substitute.For<IPaymentReconciliationService>();
    private readonly ISepaySignatureVerifier _signatureVerifier =
        Substitute.For<ISepaySignatureVerifier>();
    private readonly ILogger<SepayWebhookController> _logger =
        Substitute.For<ILogger<SepayWebhookController>>();

    private SepayWebhookController CreateController() => new(
        _reconciliationService,
        _signatureVerifier,
        _logger);

    private static SepayApiResponse CreateValidCallback() => new()
    {
        Status = 1,
        Transactions =
        [
            new Transaction
            {
                id = "tx-001",
                bank_brand_name = "MB Bank",
                account_number = "123456789",
                transaction_date = "2024-03-15 10:30:00",
                amount_in = "100000",
                transaction_content = "PAY-123456 TEST"
            }
        ]
    };

    private DefaultHttpContext CreateHttpContext(string? rawBody = null, string? signature = null)
    {
        var context = new DefaultHttpContext();
        context.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(rawBody ?? "{}"));
        context.Request.ContentType = "application/json";

        if (signature != null)
        {
            context.Request.Headers["X-Signature"] = signature;
        }

        return context;
    }

    #region TC01: Valid signature returns 200

    [Fact]
    public async Task ReceiveCallback_WhenSignatureValid_ShouldReturn200()
    {
        // Arrange
        var callbackData = CreateValidCallback();
        var rawBody = JsonSerializer.Serialize(callbackData);
        var validSignature = "valid-signature";

        _signatureVerifier.Verify(rawBody, validSignature).Returns(true);
        _reconciliationService.ReconcileProviderCallbackAsync(
            Arg.Any<SepayTransactionData>(), Arg.Any<string>())
            .Returns(new PaymentStatusSnapshot(
                TransactionCode: "PAY-123456",
                NormalizedStatus: "completed",
                RawStatus: "Completed",
                Source: "webhook",
                VerifiedWithProvider: true,
                IsTerminal: true,
                CheckedAt: DateTimeOffset.UtcNow,
                ProviderTransactionId: "tx-001"));

        var context = CreateHttpContext(rawBody, validSignature);
        var controller = CreateController();
        controller.ControllerContext = new ControllerContext { HttpContext = context };

        // Act
        var result = await controller.ReceiveCallback();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    #endregion

    #region TC02: Invalid signature returns 403

    [Fact]
    public async Task ReceiveCallback_WhenSignatureInvalid_ShouldReturn403()
    {
        // Arrange
        var callbackData = CreateValidCallback();
        var rawBody = JsonSerializer.Serialize(callbackData);
        var invalidSignature = "invalid-signature";

        _signatureVerifier.Verify(rawBody, invalidSignature).Returns(false);

        var context = CreateHttpContext(rawBody, invalidSignature);
        var controller = CreateController();
        controller.ControllerContext = new ControllerContext { HttpContext = context };

        // Act
        var result = await controller.ReceiveCallback();

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(403, statusResult.StatusCode);
    }

    #endregion

    #region TC03: Missing signature header returns 403

    [Fact]
    public async Task ReceiveCallback_WhenSignatureMissing_ShouldReturn403()
    {
        // Arrange
        var context = CreateHttpContext("{\"status\":1}", signature: null);
        var controller = CreateController();
        controller.ControllerContext = new ControllerContext { HttpContext = context };

        // Act
        var result = await controller.ReceiveCallback();

        // Assert
        var statusResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(403, statusResult.StatusCode);
    }

    #endregion

    #region TC04: Empty transactions returns 200 OK

    [Fact]
    public async Task ReceiveCallback_WhenNoTransactions_ShouldReturn200()
    {
        // Arrange
        var callbackData = new SepayApiResponse { Status = 1, Transactions = [] };
        var rawBody = JsonSerializer.Serialize(callbackData);
        var validSignature = "valid-sig";

        _signatureVerifier.Verify(rawBody, validSignature).Returns(true);

        var context = CreateHttpContext(rawBody, validSignature);
        var controller = CreateController();
        controller.ControllerContext = new ControllerContext { HttpContext = context };

        // Act
        var result = await controller.ReceiveCallback();

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }

    #endregion
}
