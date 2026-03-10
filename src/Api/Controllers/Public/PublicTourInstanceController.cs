using Api.Endpoint;
using Application.Features.Public.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[AllowAnonymous]
[Route(PublicEndpoint.Base + "/" + PublicEndpoint.TourInstances)]
public class PublicTourInstanceController : BaseApiController
{
    [HttpGet(PublicEndpoint.Available)]
    public async Task<IActionResult> GetAvailable(
        [FromQuery] string? destination,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await Sender.Send(new GetPublicTourInstancesQuery(destination, page, pageSize));
        return HandleResult(result);
    }

    [HttpGet(PublicEndpoint.Detail)]
    public async Task<IActionResult> GetDetail(Guid id)
    {
        var result = await Sender.Send(new GetPublicTourInstanceDetailQuery(id));
        return HandleResult(result);
    }
}
