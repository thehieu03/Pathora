using System.Security.Cryptography;
using System.Text;

using Application.Services;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;

namespace Domain.Specs.Application.Services;

public sealed class SepaySignatureVerifierTests
{
    private readonly IConfiguration _configuration = Substitute.For<IConfiguration>();
    private readonly ILogger<SepaySignatureVerifier> _logger = Substitute.For<ILogger<SepaySignatureVerifier>>();

    private SepaySignatureVerifier CreateVerifier(string? secret) =>
        new(_configuration, _logger);

    #region TC01: Valid signature returns true

    [Fact]
    public void Verify_WhenSignatureMatches_ShouldReturnTrue()
    {
        // Arrange
        const string secret = "test-webhook-secret";
        _configuration["Payment:SepayWebhookSecret"].Returns(secret);

        var rawBody = "{\"transactions\":[]}";
        var expectedHash = Convert.ToHexString(
            HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), Encoding.UTF8.GetBytes(rawBody)))
            .ToLowerInvariant();

        var verifier = CreateVerifier(secret);

        // Act
        var result = verifier.Verify(rawBody, expectedHash);

        // Assert
        Assert.True(result);
    }

    #endregion

    #region TC02: Invalid signature returns false

    [Fact]
    public void Verify_WhenSignatureDoesNotMatch_ShouldReturnFalse()
    {
        // Arrange
        const string secret = "test-webhook-secret";
        _configuration["Payment:SepayWebhookSecret"].Returns(secret);

        var rawBody = "{\"transactions\":[]}";
        var wrongSignature = "definitely_not_a_valid_hmac_signature";

        var verifier = CreateVerifier(secret);

        // Act
        var result = verifier.Verify(rawBody, wrongSignature);

        // Assert
        Assert.False(result);
    }

    #endregion

    #region TC03: Empty secret returns true (graceful degradation)

    [Fact]
    public void Verify_WhenSecretEmpty_ShouldReturnTrue()
    {
        // Arrange
        _configuration["Payment:SepayWebhookSecret"].Returns("${SEPAY_WEBHOOK_SECRET}");

        var verifier = CreateVerifier("${SEPAY_WEBHOOK_SECRET}");

        // Act
        var result = verifier.Verify("{\"data\":\"test\"}", "any-signature");

        // Assert
        Assert.True(result); // graceful degradation
        _logger.ReceivedWithAnyArgs().Log(
            LogLevel.Warning,
            Arg.Any<EventId>(),
            Arg.Any<object>(),
            Arg.Any<Exception>(),
            Arg.Any<Func<object, Exception?, string>>());
    }

    #endregion

    #region TC04: Missing signature returns false

    [Fact]
    public void Verify_WhenSignatureMissing_ShouldReturnFalse()
    {
        // Arrange
        _configuration["Payment:SepayWebhookSecret"].Returns("test-secret");
        var verifier = CreateVerifier("test-secret");

        // Act
        var result = verifier.Verify("{\"data\":\"test\"}", "");

        // Assert
        Assert.False(result);
    }

    #endregion

    #region TC05: Case insensitive signature comparison

    [Fact]
    public void Verify_WhenSignatureCaseMismatch_ShouldReturnTrue()
    {
        // Arrange
        const string secret = "test-secret";
        _configuration["Payment:SepayWebhookSecret"].Returns(secret);

        var rawBody = "{\"test\":true}";
        var expectedHash = Convert.ToHexString(
            HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), Encoding.UTF8.GetBytes(rawBody)))
            .ToLowerInvariant();
        var upperCaseSignature = expectedHash.ToUpperInvariant();

        var verifier = CreateVerifier(secret);

        // Act
        var result = verifier.Verify(rawBody, upperCaseSignature);

        // Assert
        Assert.True(result);
    }

    #endregion
}
