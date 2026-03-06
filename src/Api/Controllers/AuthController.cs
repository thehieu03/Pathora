using Api.Endpoint;
using Contracts.Interfaces;
using Application.Features.Identity.Commands;
using Application.Features.Identity.Queries;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Route(AuthEndpoint.Base)]
public class AuthController : BaseApiController
{
    [HttpPost(AuthEndpoint.Login)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await Sender.Send(command);
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
        return HandleResult(result);
    }

    [Authorize]
    [HttpPost(AuthEndpoint.Logout)]
    public async Task<IActionResult> Logout([FromBody] LogoutCommand command)
    {
        var result = await Sender.Send(command);
        return HandleResult(result);
    }

    [Authorize]
    [HttpGet(AuthEndpoint.Me)]
    public async Task<IActionResult> GetUserInfo()
    {
        var result = await Sender.Send(new GetUserInfoQuery());
        return HandleResult(result);
    }

    [Authorize]
    [HttpGet(AuthEndpoint.Tabs)]
    public async Task<IActionResult> GetTabs()
    {
        var result = await Sender.Send(new GetTabsQuery());
        return HandleResult(result);
    }

    /// <summary>DEV ONLY – reset a user password without authentication.</summary>
    [HttpPost(AuthEndpoint.DevResetPassword)]
    public async Task<IActionResult> DevResetPassword(
        [FromBody] DevResetPasswordRequest request,
        [FromServices] AppDbContext db,
        [FromServices] IPasswordHasher hasher,
        [FromServices] IWebHostEnvironment env)
    {
        if (!env.IsDevelopment())
            return NotFound();

        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && !u.IsDeleted);

        if (user is null)
            return NotFound(new { message = $"Không tìm thấy user với email: {request.Email}" });

        user.ChangePassword(hasher.HashPassword(request.NewPassword), "dev-reset");
        await db.SaveChangesAsync();

        return Ok(new { message = $"Đã đổi mật khẩu cho {user.Email} (username: {user.Username})" });
    }
}

public sealed record DevResetPasswordRequest(string Email, string NewPassword);
