using Application.Contracts.Identity;
using Application.Features.Identity.Commands;
using Application.Services;
using ErrorOr;
using NSubstitute;

namespace Domain.Specs.Application.Handlers;

public sealed class IdentityCommandHandlerTests
{
    // ── Login ───────────────────────────────────────────────

    [Fact]
    public async Task LoginHandler_ShouldDelegateToIdentityService()
    {
        var identityService = Substitute.For<IIdentityService>();
        var expected = new LoginResponse("access-token", "refresh-token", "admin", "/dashboard");
        identityService.Login(Arg.Any<LoginRequest>()).Returns(expected);

        var handler = new LoginCommandHandler(identityService);
        var result = await handler.Handle(
            new LoginCommand("admin@example.com", "secret"), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(expected, result.Value);
        await identityService.Received(1).Login(
            Arg.Is<LoginRequest>(r => r.Email == "admin@example.com" && r.Password == "secret"));
    }

    [Fact]
    public async Task LoginHandler_WhenServiceReturnsError_ShouldPropagateError()
    {
        var identityService = Substitute.For<IIdentityService>();
        identityService.Login(Arg.Any<LoginRequest>())
            .Returns(Error.Unauthorized("Identity.InvalidCredentials", "Invalid"));

        var handler = new LoginCommandHandler(identityService);
        var result = await handler.Handle(
            new LoginCommand("admin@example.com", "wrong"), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Identity.InvalidCredentials", result.FirstError.Code);
    }

    // ── Register ────────────────────────────────────────────

    [Fact]
    public async Task RegisterHandler_ShouldDelegateToIdentityService()
    {
        var identityService = Substitute.For<IIdentityService>();
        identityService.Register(Arg.Any<RegisterRequest>()).Returns(Result.Success);

        var handler = new RegisterCommandHandler(identityService);
        var result = await handler.Handle(
            new RegisterCommand("john", "John Doe", "john@example.com", "secret123"),
            CancellationToken.None);

        Assert.False(result.IsError);
        await identityService.Received(1).Register(
            Arg.Is<RegisterRequest>(r =>
                r.Username == "john" &&
                r.FullName == "John Doe" &&
                r.Email == "john@example.com" &&
                r.Password == "secret123"));
    }

    [Fact]
    public async Task RegisterHandler_WhenEmailConflict_ShouldPropagateError()
    {
        var identityService = Substitute.For<IIdentityService>();
        identityService.Register(Arg.Any<RegisterRequest>())
            .Returns(Error.Conflict("Identity.EmailConflict", "Email already exists"));

        var handler = new RegisterCommandHandler(identityService);
        var result = await handler.Handle(
            new RegisterCommand("john", "John Doe", "john@example.com", "secret123"),
            CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Identity.EmailConflict", result.FirstError.Code);
    }

    // ── Logout ──────────────────────────────────────────────

    [Fact]
    public async Task LogoutHandler_ShouldDelegateToIdentityService()
    {
        var identityService = Substitute.For<IIdentityService>();
        identityService.Logout(Arg.Any<LogoutRequest>()).Returns(Result.Success);

        var handler = new LogoutCommandHandler(identityService);
        var result = await handler.Handle(
            new LogoutCommand("refresh-token"), CancellationToken.None);

        Assert.False(result.IsError);
        await identityService.Received(1).Logout(
            Arg.Is<LogoutRequest>(r => r.RefreshToken == "refresh-token"));
    }

    // ── Refresh ─────────────────────────────────────────────

    [Fact]
    public async Task RefreshHandler_ShouldDelegateToIdentityService()
    {
        var identityService = Substitute.For<IIdentityService>();
        var expected = new RefreshTokenResponse("new-access", "new-refresh", "admin", "/dashboard");
        identityService.Refresh(Arg.Any<RefreshTokenRequest>()).Returns(expected);

        var handler = new RefreshCommandHandler(identityService);
        var result = await handler.Handle(
            new RefreshCommand("old-refresh"), CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(expected, result.Value);
        await identityService.Received(1).Refresh(
            Arg.Is<RefreshTokenRequest>(r => r.RefreshToken == "old-refresh"));
    }

    [Fact]
    public async Task RefreshHandler_WhenTokenInvalid_ShouldPropagateError()
    {
        var identityService = Substitute.For<IIdentityService>();
        identityService.Refresh(Arg.Any<RefreshTokenRequest>())
            .Returns(Error.Unauthorized("Identity.InvalidRefreshToken", "Invalid token"));

        var handler = new RefreshCommandHandler(identityService);
        var result = await handler.Handle(
            new RefreshCommand("invalid"), CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Identity.InvalidRefreshToken", result.FirstError.Code);
    }

    // ── ExternalLogin ───────────────────────────────────────

    [Fact]
    public async Task ExternalLoginHandler_ShouldDelegateToIdentityService()
    {
        var identityService = Substitute.For<IIdentityService>();
        var expected = new ExternalLoginResponse("access-token", "refresh-token", "admin", "/dashboard");
        identityService.ExternalLogin(Arg.Any<ExternalLoginRequest>()).Returns(expected);

        var handler = new ExternalLoginCommandHandler(identityService);
        var result = await handler.Handle(
            new ExternalLoginCommand("google-id-123", "user@gmail.com", "Test User"),
            CancellationToken.None);

        Assert.False(result.IsError);
        Assert.Equal(expected, result.Value);
        await identityService.Received(1).ExternalLogin(
            Arg.Is<ExternalLoginRequest>(r =>
                r.Provider == "Google" &&
                r.ProviderKey == "google-id-123" &&
                r.ProviderEmail == "user@gmail.com" &&
                r.FullName == "Test User"));
    }

    [Fact]
    public async Task ExternalLoginHandler_WhenServiceReturnsError_ShouldPropagateError()
    {
        var identityService = Substitute.For<IIdentityService>();
        identityService.ExternalLogin(Arg.Any<ExternalLoginRequest>())
            .Returns(Error.Failure("Identity.ExternalLoginFailed", "Failed"));

        var handler = new ExternalLoginCommandHandler(identityService);
        var result = await handler.Handle(
            new ExternalLoginCommand("google-id-123", "user@gmail.com", "Test User"),
            CancellationToken.None);

        Assert.True(result.IsError);
        Assert.Equal("Identity.ExternalLoginFailed", result.FirstError.Code);
    }
}
