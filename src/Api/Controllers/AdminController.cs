using Api.Endpoint;
using Application.Features.Admin.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[Route(AdminEndpoint.Base)]
public class AdminController : BaseApiController
{
    [HttpGet(AdminEndpoint.Overview)]
    public async Task<IActionResult> GetOverview()
    {
        var result = await Sender.Send(new GetAdminOverviewQuery());
        return HandleResult(result);
    }
}
