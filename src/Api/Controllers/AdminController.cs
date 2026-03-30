using Api.Endpoint;
using Application.Common.Constant;
using Application.Features.Admin.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize(Roles = RoleConstants.SuperAdmin_Admin)]
[Route(AdminEndpoint.Base)]
public class AdminController : BaseApiController
{
    [HttpGet(AdminEndpoint.Overview)]
    public async Task<IActionResult> GetOverview()
    {
        var result = await Sender.Send(new GetAdminOverviewQuery());
        return HandleResult(result);
    }

    [HttpGet(AdminEndpoint.Dashboard)]
    public async Task<IActionResult> GetDashboard()
    {
        var result = await Sender.Send(new GetAdminDashboardQuery());
        return HandleResult(result);
    }

    [HttpGet(AdminEndpoint.TourManagement)]
    public async Task<IActionResult> GetTourManagement(
        [FromQuery] string? searchText,
        [FromQuery] Domain.Enums.TourStatus? status,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await Sender.Send(new GetAdminTourManagementQuery(searchText, status, pageNumber, pageSize));
        return HandleResult(result);
    }
}
