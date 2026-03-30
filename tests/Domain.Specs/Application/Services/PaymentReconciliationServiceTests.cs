using System.Net;
using System.Text.Json;

using Application.Services;
using Contracts.Interfaces;
using Domain.ApiThirdPatyResponse;
using Domain.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.UnitOfWork;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;

namespace Domain.Specs.Application.Services;

public sealed class PaymentReconciliationServiceTests
{
    private readonly IPaymentTransactionRepository _transactionRepo = Substitute.For<IPaymentTransactionRepository>();
    private readonly IPaymentService _paymentService = Substitute.For<IPaymentService>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly IConfiguration _configuration = Substitute.For<IConfiguration>();
    private readonly ILogger<PaymentReconciliationService> _logger = Substitute.For<ILogger<PaymentReconciliationService>>();

    #region Amount Matching Tests

    #region TC01: FetchMatchingProviderTransaction matches when only amount_in is present

    [Fact]
    public async Task FetchMatchingProviderTransaction_WhenAmountInOnly_ShouldMatch()
    {
        // Arrange
        const string authKey = "test-auth-key";
        const string accountNumber = "123456789";
        const string apiBaseUrl = "https://test.sepay.vn";

        _configuration["Payment:AuthenticationKey"].Returns(authKey);
        _configuration["Payment:Account"].Returns(accountNumber);
        _configuration["Payment:ApiBaseUrl"].Returns(apiBaseUrl);

        var transaction = CreatePendingTransaction(100000m);

        var sepayResponse = CreateSepayApiResponse(
            transactions:
            [
                new Transaction
                {
                    id = "tx-in-only",
                    transaction_content = "PAY-TEST-AMOUNT 100000",
                    amount_in = "100000",
                    amount_out = null,
                    transaction_date = "2024-03-15 10:30:00"
                }
            ]);

        var mockHandler = new MockHttpMessageHandler(sepayResponse);
        var service = CreateServiceWithHttpClient(new HttpClient(mockHandler));

        // Act
        var result = await service.FetchMatchingProviderTransactionAsync(transaction);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("tx-in-only", result!.id);
    }

    #endregion

    #region TC02: FetchMatchingProviderTransaction matches when only amount_out is present

    [Fact]
    public async Task FetchMatchingProviderTransaction_WhenAmountOutOnly_ShouldMatch()
    {
        // Arrange
        _configuration["Payment:AuthenticationKey"].Returns("test-auth-key");
        _configuration["Payment:Account"].Returns("123456789");
        _configuration["Payment:ApiBaseUrl"].Returns("https://test.sepay.vn");

        var transaction = CreatePendingTransaction(100000m);

        var sepayResponse = CreateSepayApiResponse(
            transactions:
            [
                new Transaction
                {
                    id = "tx-out-only",
                    transaction_content = "PAY-TEST-AMOUNT",
                    amount_in = null,
                    amount_out = "100000",
                    transaction_date = "2024-03-15 10:30:00"
                }
            ]);

        var mockHandler = new MockHttpMessageHandler(sepayResponse);
        var service = CreateServiceWithHttpClient(new HttpClient(mockHandler));

        // Act
        var result = await service.FetchMatchingProviderTransactionAsync(transaction);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("tx-out-only", result!.id);
    }

    #endregion

    #region TC03: FetchMatchingProviderTransaction does NOT match when amount is larger (SECURITY TEST)

    [Fact]
    public async Task FetchMatchingProviderTransaction_WhenAmountLarger_ShouldNotMatch()
    {
        // Arrange
        _configuration["Payment:AuthenticationKey"].Returns("test-auth-key");
        _configuration["Payment:Account"].Returns("123456789");
        _configuration["Payment:ApiBaseUrl"].Returns("https://test.sepay.vn");

        var transaction = CreatePendingTransaction(100000m);

        // Transaction amount is LARGER than expected — should NOT match
        var sepayResponse = CreateSepayApiResponse(
            transactions:
            [
                new Transaction
                {
                    id = "tx-too-much",
                    transaction_content = "PAY-TEST-AMOUNT",
                    amount_in = "200000", // 2x the expected amount
                    amount_out = null,
                    transaction_date = "2024-03-15 10:30:00"
                }
            ]);

        var mockHandler = new MockHttpMessageHandler(sepayResponse);
        var service = CreateServiceWithHttpClient(new HttpClient(mockHandler));

        // Act
        var result = await service.FetchMatchingProviderTransactionAsync(transaction);

        // Assert — larger amount must NOT match (security)
        Assert.Null(result);
    }

    #endregion

    #region TC04: FetchMatchingProviderTransaction matches exact amount (boundary)

    [Fact]
    public async Task FetchMatchingProviderTransaction_WhenExactAmount_ShouldMatch()
    {
        // Arrange
        _configuration["Payment:AuthenticationKey"].Returns("test-auth-key");
        _configuration["Payment:Account"].Returns("123456789");
        _configuration["Payment:ApiBaseUrl"].Returns("https://test.sepay.vn");

        var transaction = CreatePendingTransaction(99999m);

        var sepayResponse = CreateSepayApiResponse(
            transactions:
            [
                new Transaction
                {
                    id = "tx-exact",
                    transaction_content = "PAY-TEST-AMOUNT",
                    amount_in = "99999",
                    amount_out = null,
                    transaction_date = "2024-03-15 10:30:00"
                }
            ]);

        var mockHandler = new MockHttpMessageHandler(sepayResponse);
        var service = CreateServiceWithHttpClient(new HttpClient(mockHandler));

        // Act
        var result = await service.FetchMatchingProviderTransactionAsync(transaction);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("tx-exact", result!.id);
    }

    #endregion

    #endregion

    #region Helper Methods

    private static PaymentTransactionEntity CreatePendingTransaction(decimal amount)
    {
        var t = PaymentTransactionEntity.Create(
            bookingId: Guid.NewGuid(),
            transactionCode: "PAY-TEST-AMOUNT",
            type: TransactionType.Deposit,
            amount: amount,
            paymentMethod: PaymentMethod.BankTransfer,
            paymentNote: "Test",
            createdBy: "test",
            expiredAt: DateTimeOffset.UtcNow.AddHours(1));
        return t;
    }

    private static SepayApiResponse CreateSepayApiResponse(List<Transaction> transactions) =>
        new()
        {
            Status = 1,
            Transactions = transactions
        };

    private PaymentReconciliationService CreateServiceWithHttpClient(HttpClient httpClient)
    {
        // Use reflection to create service with custom HttpClient
        // since the service creates its own HttpClient in the field
        var serviceType = typeof(PaymentReconciliationService);
        var ctor = serviceType.GetConstructors().First();
        var service = ctor.Invoke(new object[]
        {
            _transactionRepo,
            _paymentService,
            _unitOfWork,
            _configuration,
            _logger
        });

        // Replace the private _httpClient field
        var httpClientField = serviceType.GetField("_httpClient",
            System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
        httpClientField!.SetValue(service, httpClient);

        return (PaymentReconciliationService)service;
    }

    #endregion
}

/// <summary>
/// Test helper that simulates the SePay API HTTP response.
/// </summary>
internal sealed class MockHttpMessageHandler : HttpMessageHandler
{
    private readonly SepayApiResponse _response;

    public MockHttpMessageHandler(SepayApiResponse response)
    {
        _response = response;
    }

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var json = JsonSerializer.Serialize(_response, new JsonSerializerOptions { PropertyNamingPolicy = null });
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

        return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = content
        });
    }
}
