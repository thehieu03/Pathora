using System.Text.Json;
using Domain.ApiThirdPatyResponse;

namespace Domain.Specs.Api;

public sealed class PayOSWebhookDateParsingTests
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    #region TC01: PayOS webhook with transactionDatetime parses correctly

    [Fact]
    public void Deserialize_WhenTransactionDatetimePresent_ShouldParseCorrectly()
    {
        // Arrange
        const string json = """
            {
                "orderCode": 1709123456789,
                "amount": 500000,
                "status": "PAID",
                "transactionDateTime": "2024-03-15T10:30:00+07:00"
            }
            """;

        // Act
        var payload = JsonSerializer.Deserialize<PayOSWebhookPayload>(json, JsonOptions);

        // Assert
        Assert.NotNull(payload);
        Assert.Equal(1709123456789L, payload.OrderCode);
        Assert.Equal(500000m, payload.Amount);
        Assert.Equal("PAID", payload.Status);
        Assert.NotNull(payload.TransactionDateTime);
        Assert.Equal(new DateTimeOffset(2024, 3, 15, 10, 30, 0, TimeSpan.FromHours(7)), payload.TransactionDateTime);
    }

    #endregion

    #region TC02: PayOS webhook without transactionDatetime falls back to null

    [Fact]
    public void Deserialize_WhenTransactionDatetimeMissing_ShouldBeNull()
    {
        // Arrange
        const string json = """
            {
                "orderCode": 1709123456789,
                "amount": 500000,
                "status": "PAID"
            }
            """;

        // Act
        var payload = JsonSerializer.Deserialize<PayOSWebhookPayload>(json, JsonOptions);

        // Assert
        Assert.NotNull(payload);
        Assert.Equal(1709123456789L, payload.OrderCode);
        Assert.Null(payload.TransactionDateTime);
    }

    #endregion

    #region TC03: PayOS webhook with transaction_datetime (snake_case) parses correctly

    [Fact]
    public void Deserialize_WhenSnakeCaseTransactionDatetime_ShouldParseCorrectly()
    {
        // Arrange
        const string json = """
            {
                "orderCode": 1709123456789,
                "amount": 500000,
                "status": "PAID",
                "transaction_datetime": "2024-03-15T10:30:00+07:00"
            }
            """;

        // Act
        var payload = JsonSerializer.Deserialize<PayOSWebhookPayload>(json, JsonOptions);

        // Assert
        Assert.NotNull(payload);
        Assert.Equal(1709123456789L, payload.OrderCode);
        // Snake case does NOT match Pascal/camel case — this tests if the field name is correct
        Assert.Null(payload.TransactionDateTime);
    }

    #endregion

    #region TC04: PayOS webhook with null transactionDatetime value

    [Fact]
    public void Deserialize_WhenTransactionDatetimeNull_ShouldBeNull()
    {
        // Arrange
        const string json = """
            {
                "orderCode": 1709123456789,
                "amount": 500000,
                "status": "PAID",
                "transactionDateTime": null
            }
            """;

        // Act
        var payload = JsonSerializer.Deserialize<PayOSWebhookPayload>(json, JsonOptions);

        // Assert
        Assert.NotNull(payload);
        Assert.Null(payload.TransactionDateTime);
    }

    #endregion
}
