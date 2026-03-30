using Api.Controllers;
using Application.Services;
using Domain.ApiThirdPatyResponse;
using Domain.Entities;
using Domain.Enums;
using ErrorOr;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSubstitute;

namespace Domain.Specs.Api;

public sealed class PayOSWebhookControllerTests
{
    private readonly IPayOSClient _payOSClient = Substitute.For<IPayOSClient>();
    private readonly IPaymentService _paymentService = Substitute.For<IPaymentService>();
    private readonly ILogger<PayOSWebhookController> _logger = Substitute.For<ILogger<PayOSWebhookController>>();

    private PayOSWebhookController BuildController(HttpContext? httpContext = null)
    {
        var controller = new PayOSWebhookController(_payOSClient, _paymentService, _logger);

        httpContext ??= new DefaultHttpContext();
        httpContext.Request.ContentType = "application/json";

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        return controller;
    }

    private static HttpContext CreateHttpContextWithBody(string body, string? signature = "valid-sig")
    {
        var context = new DefaultHttpContext();
        context.Request.Body = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(body));
        context.Request.ContentType = "application/json";
        if (signature != null)
            context.Request.Headers["x-signature"] = signature;
        return context;
    }

    [Fact]
    public async Task ReceiveWebhook_WhenSignatureHeaderMissing_ShouldReturn403()
    {
        var body = """{"orderCode":1709123456789,"amount":500000,"status":"PAID"}""";
        var context = CreateHttpContextWithBody(body, null);
        var controller = BuildController(context);

        var result = await controller.ReceiveWebhook();

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(403, objectResult.StatusCode);

        _payOSClient.Received(0).VerifyWebhookSignature(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task ReceiveWebhook_WhenSignatureIsValid_ShouldReturn200AndCallProcessCallback()
    {
        var body = """{"orderCode":1709123456789,"amount":500000,"status":"PAID","transactionDateTime":"2024-03-15T10:30:00"}""";
        var context = CreateHttpContextWithBody(body, "valid-sig");
        var controller = BuildController(context);

        _payOSClient.VerifyWebhookSignature("valid-sig", body).Returns(true);

        var transaction = PaymentTransactionEntity.Create(
            bookingId: Guid.CreateVersion7(),
            transactionCode: "1709123456789",
            type: TransactionType.Deposit,
            amount: 500000m,
            paymentMethod: PaymentMethod.BankTransfer,
            paymentNote: "Test",
            createdBy: "test",
            expiredAt: DateTimeOffset.UtcNow.AddMinutes(30));
        transaction.MarkAsPaid(500000m, DateTimeOffset.UtcNow, "ext-123");

        _paymentService.ProcessPayOSCallbackAsync(
            "1709123456789",
            500000m,
            TransactionStatus.Completed,
            Arg.Any<DateTimeOffset>())
            .Returns(transaction);

        var result = await controller.ReceiveWebhook();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        await _paymentService.Received(1).ProcessPayOSCallbackAsync(
            "1709123456789",
            500000m,
            TransactionStatus.Completed,
            Arg.Any<DateTimeOffset>());
    }

    [Fact]
    public async Task ReceiveWebhook_WhenSignatureIsInvalid_ShouldReturn403AndNotCallProcessCallback()
    {
        var body = """{"orderCode":1709123456789,"amount":500000,"status":"PAID"}""";
        var context = CreateHttpContextWithBody(body, "invalid-sig");
        var controller = BuildController(context);

        _payOSClient.VerifyWebhookSignature("invalid-sig", body).Returns(false);

        var result = await controller.ReceiveWebhook();

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(403, objectResult.StatusCode);

        await _paymentService.Received(0).ProcessPayOSCallbackAsync(
            Arg.Any<string>(),
            Arg.Any<decimal>(),
            Arg.Any<TransactionStatus>(),
            Arg.Any<DateTimeOffset>());
    }

    [Fact]
    public async Task ReceiveWebhook_WhenStatusIsPaid_ShouldMapToTransactionStatusCompleted()
    {
        var body = """{"orderCode":1709123456789,"amount":500000,"status":"PAID"}""";
        var context = CreateHttpContextWithBody(body, "valid-sig");
        var controller = BuildController(context);

        _payOSClient.VerifyWebhookSignature("valid-sig", body).Returns(true);

        var transaction = PaymentTransactionEntity.Create(
            bookingId: Guid.CreateVersion7(),
            transactionCode: "1709123456789",
            type: TransactionType.Deposit,
            amount: 500000m,
            paymentMethod: PaymentMethod.BankTransfer,
            paymentNote: "Test",
            createdBy: "test",
            expiredAt: DateTimeOffset.UtcNow.AddMinutes(30));
        transaction.MarkAsPaid(500000m, DateTimeOffset.UtcNow, "ext-123");

        _paymentService.ProcessPayOSCallbackAsync(
            "1709123456789",
            500000m,
            TransactionStatus.Completed,
            Arg.Any<DateTimeOffset>())
            .Returns(transaction);

        await controller.ReceiveWebhook();

        await _paymentService.Received(1).ProcessPayOSCallbackAsync(
            "1709123456789",
            500000m,
            TransactionStatus.Completed,
            Arg.Any<DateTimeOffset>());
    }

    [Fact]
    public async Task ReceiveWebhook_WhenStatusIsCancelled_ShouldMapToTransactionStatusCancelled()
    {
        var body = """{"orderCode":1709123456789,"amount":500000,"status":"CANCELLED"}""";
        var context = CreateHttpContextWithBody(body, "valid-sig");
        var controller = BuildController(context);

        _payOSClient.VerifyWebhookSignature("valid-sig", body).Returns(true);

        var transaction = PaymentTransactionEntity.Create(
            bookingId: Guid.CreateVersion7(),
            transactionCode: "1709123456789",
            type: TransactionType.Deposit,
            amount: 500000m,
            paymentMethod: PaymentMethod.BankTransfer,
            paymentNote: "Test",
            createdBy: "test",
            expiredAt: DateTimeOffset.UtcNow.AddMinutes(30));
        transaction.MarkAsPaid(500000m, DateTimeOffset.UtcNow, "ext-123");

        _paymentService.ProcessPayOSCallbackAsync(
            "1709123456789",
            500000m,
            TransactionStatus.Cancelled,
            Arg.Any<DateTimeOffset>())
            .Returns(transaction);

        await controller.ReceiveWebhook();

        await _paymentService.Received(1).ProcessPayOSCallbackAsync(
            "1709123456789",
            500000m,
            TransactionStatus.Cancelled,
            Arg.Any<DateTimeOffset>());
    }

    [Fact]
    public async Task ReceiveWebhook_WhenTransactionAlreadyCompleted_ShouldReturn200Idempotently()
    {
        var body = """{"orderCode":1709123456789,"amount":500000,"status":"PAID"}""";

        _payOSClient.VerifyWebhookSignature("valid-sig", body).Returns(true);

        var transaction = PaymentTransactionEntity.Create(
            bookingId: Guid.CreateVersion7(),
            transactionCode: "1709123456789",
            type: TransactionType.Deposit,
            amount: 500000m,
            paymentMethod: PaymentMethod.BankTransfer,
            paymentNote: "Test",
            createdBy: "test",
            expiredAt: DateTimeOffset.UtcNow.AddMinutes(30));
        transaction.MarkAsPaid(500000m, DateTimeOffset.UtcNow, "ext-123");

        _paymentService.ProcessPayOSCallbackAsync(
            "1709123456789",
            500000m,
            TransactionStatus.Completed,
            Arg.Any<DateTimeOffset>())
            .Returns(transaction);

        // First webhook call
        var context1 = CreateHttpContextWithBody(body, "valid-sig");
        var controller1 = BuildController(context1);
        var result1 = await controller1.ReceiveWebhook();

        // Second webhook call (duplicate) with fresh body stream
        var context2 = CreateHttpContextWithBody(body, "valid-sig");
        var controller2 = BuildController(context2);
        var result2 = await controller2.ReceiveWebhook();

        // Both return 200 OK — idempotent behavior
        Assert.IsType<OkObjectResult>(result1);
        Assert.IsType<OkObjectResult>(result2);
    }
}
