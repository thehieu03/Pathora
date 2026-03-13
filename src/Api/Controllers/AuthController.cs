using Api.Endpoint;
using Api.Infrastructure;
using Application.Common.Constant;
using Contracts.Interfaces;
using Application.Features.Identity.Commands;
using Application.Features.Identity.Queries;
using ErrorOr;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Api.Controllers;

[Route(AuthEndpoint.Base)]
[EnableRateLimiting("auth-strict")]
public class AuthController : BaseApiController
{
    [HttpPost(AuthEndpoint.Login)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await Sender.Send(command);

        if (!result.IsError)
        {
            AuthCookieWriter.WriteAuthStatusCookie(Response, Request.IsHttps);
            AuthCookieWriter.WriteAuthPortalCookie(Response, result.Value.Portal, Request.IsHttps);
        }

        return HandleResult(result);
    }

    [HttpPost(AuthEndpoint.Register)]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await Sender.Send(command);
        return HandleResult(result);
    }

    [HttpPost(AuthEndpoint.Refresh)]
    public async Task<IActionResult> Refresh([FromBody] RefreshCommand command)
    {
        var result = await Sender.Send(command);

        if (!result.IsError)
        {
            AuthCookieWriter.WriteAuthStatusCookie(Response, Request.IsHttps);
            AuthCookieWriter.WriteAuthPortalCookie(Response, result.Value.Portal, Request.IsHttps);
        }
        else if (result.Errors.Any(error => error.Type is ErrorType.Unauthorized or ErrorType.NotFound))
        {
            AuthCookieWriter.ClearAuthCookies(Response, Request.IsHttps);
        }

        return HandleResult(result);
    }
    [HttpPost(AuthEndpoint.ConfirmRegister)]
    public async Task<IActionResult> ConfirmRegister([FromBody] ConfirmCommand command)
    {
        var result = await Sender.Send(command);
        return HandleResult(result);
    }
    [Authorize]
    [HttpPost(AuthEndpoint.Logout)]
    public async Task<IActionResult> Logout([FromBody] LogoutCommand command)
    {
        var refreshToken = string.IsNullOrWhiteSpace(command.RefreshToken)
            ? Request.Cookies["refresh_token"] ?? string.Empty
            : command.RefreshToken;

        var result = await Sender.Send(command with { RefreshToken = refreshToken });
        if (!result.IsError)
        {
            AuthCookieWriter.ClearAuthCookies(Response, Request.IsHttps);
        }

        return HandleResult(result);
    }
    [Authorize]
    [HttpGet(AuthEndpoint.Me)]
    public async Task<IActionResult> GetUserInfo()
    {
        var result = await Sender.Send(new GetUserInfoQuery(CurrentUserId));

        if (!result.IsError)
        {
            AuthCookieWriter.WriteAuthStatusCookie(Response, Request.IsHttps);
            AuthCookieWriter.WriteAuthPortalCookie(Response, result.Value.Portal, Request.IsHttps);
        }

        return HandleResult(result);
    }

    [Authorize]
    [HttpGet(AuthEndpoint.Tabs)]
    public async Task<IActionResult> GetTabs()
    {
        var result = await Sender.Send(new GetTabsQuery(CurrentUserId));
        return HandleResult(result);
    }

    /// <summary>DEV ONLY – reset a user password without authentication.</summary>
    [HttpPost(AuthEndpoint.DevResetPassword)]
    public async Task<IActionResult> DevResetPassword(
        [FromBody] DevResetPasswordRequest request,
        [FromServices] AppDbContext db,
        [FromServices] IPasswordHasher hasher,
        [FromServices] IWebHostEnvironment env,
        [FromServices] IConfiguration configuration)
    {
        if (!env.IsDevelopment() || !configuration.GetValue<bool>("Dev:EnableDevEndpoints"))
            return NotFound();

        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && !u.IsDeleted);

        if (user is null)
            return NotFound(new
            {
                message = ErrorConstants.Auth.EmailNotFoundDescriptionTemplate.Format(CurrentLanguage, request.Email),
            });

        user.ChangePassword(hasher.HashPassword(request.NewPassword), "dev-reset");
        await db.SaveChangesAsync();

        return Ok(new
        {
            message = ErrorConstants.Auth.PasswordChangedDescriptionTemplate.Format(CurrentLanguage, user.Email, user.Username),
        });
    }

    /// <summary>DEV ONLY – reset password for all active users.</summary>
    [HttpPost(AuthEndpoint.DevResetAllPasswords)]
    public async Task<IActionResult> DevResetAllPasswords(
        [FromBody] DevResetAllPasswordsRequest request,
        [FromServices] AppDbContext db,
        [FromServices] IPasswordHasher hasher,
        [FromServices] IWebHostEnvironment env,
        [FromServices] IConfiguration configuration)
    {
        if (!env.IsDevelopment() || !configuration.GetValue<bool>("Dev:EnableDevEndpoints"))
            return NotFound();

        if (string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new
            {
                message = ErrorConstants.Auth.NewPasswordRequiredDescription.Resolve(CurrentLanguage),
            });

        var users = await db.Users
            .Where(u => !u.IsDeleted)
            .ToListAsync();

        var hashedPassword = hasher.HashPassword(request.NewPassword);
        foreach (var user in users)
        {
            user.ChangePassword(hashedPassword, "dev-reset-all");
        }

        await db.SaveChangesAsync();

        return Ok(new
        {
            message = ErrorConstants.Auth.PasswordChangedForAccountsDescriptionTemplate.Format(CurrentLanguage, users.Count),
        });
    }

    [HttpGet(AuthEndpoint.GoogleLogin)]
    public IActionResult GoogleLogin([FromServices] IConfiguration configuration)
    {
        if (!IsGoogleConfigured(configuration))
            return Redirect(GetFrontendUrl(configuration) + "/auth/callback?error=google_auth_not_configured");

        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(GoogleCallback))
        };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet(AuthEndpoint.GoogleCallback)]
    public async Task<IActionResult> GoogleCallback([FromServices] IConfiguration configuration)
    {
        var frontendUrl = GetFrontendUrl(configuration);
        var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!authenticateResult.Succeeded)
            return Redirect(frontendUrl + "/auth/callback?error=google_auth_failed");

        var claims = authenticateResult.Principal?.Claims.ToList() ?? [];
        var googleId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var fullName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

        if (string.IsNullOrEmpty(googleId) || string.IsNullOrEmpty(email))
        {
            AuthCookieWriter.ClearAuthCookies(Response, Request.IsHttps);
            return Redirect(frontendUrl + "/auth/callback?error=missing_claims");
        }

        var result = await Sender.Send(new ExternalLoginCommand(googleId, email, fullName ?? ""));

        // Sign out the cookie used during the OAuth flow
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        if (result.IsError)
        {
            AuthCookieWriter.ClearAuthCookies(Response, Request.IsHttps);
            return Redirect(frontendUrl + "/auth/callback?error=login_failed");
        }

        var response = result.Value;
        AuthCookieWriter.WriteAuthCookies(Response, response, Request.IsHttps);
        return Redirect($"{frontendUrl}/auth/callback");
    }

    private static string GetFrontendUrl(IConfiguration configuration)
    {
        return configuration["Cors:AllowedOrigins:0"] ?? "http://localhost:3000";
    }

    private static bool IsGoogleConfigured(IConfiguration configuration)
    {
        return !string.IsNullOrWhiteSpace(configuration["Authentication:Google:ClientId"]) &&
               !string.IsNullOrWhiteSpace(configuration["Authentication:Google:ClientSecret"]);
    }
}

public sealed record DevResetPasswordRequest(string Email, string NewPassword);
public sealed record DevResetAllPasswordsRequest(string NewPassword);
