using Api.Endpoint;
using Application.Features.Public.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Public;

[AllowAnonymous]
[Route(PublicEndpoint.Base + "/" + PublicEndpoint.Tours)]
public class PublicTourController : BaseApiController
{
    [HttpGet(PublicEndpoint.Detail)]
    public async Task<IActionResult> GetTourDetail(Guid id)
    {
        var result = await Sender.Send(new GetPublicTourDetailQuery(id));
        return HandleResult(result);
    }
}
