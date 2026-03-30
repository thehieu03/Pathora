namespace Domain.ApiThirdPatyResponse;

public record PayOSWebhookPayload(
    long OrderCode,
    decimal Amount,
    string? Status,
    DateTimeOffset? TransactionDateTime);
