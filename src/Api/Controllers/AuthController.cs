using Api.Endpoint;
using Application.Features.Identity.Commands.Login;
using Application.Features.Identity.Commands.Logout;
using Application.Features.Identity.Commands.Refresh;
using Application.Features.Identity.Commands.Register;
using Application.Features.Identity.Queries.GetTabs;
using Application.Features.Identity.Queries.GetUserInfo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
}
