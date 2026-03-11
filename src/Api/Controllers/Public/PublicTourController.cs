using Api.Endpoint;
using Application.Features.Public.Queries;
using Contracts.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Public;

[AllowAnonymous]
[Route(PublicEndpoint.Base + "/" + PublicEndpoint.Tours)]
public class PublicTourController : BaseApiController
{
    [HttpGet(PublicEndpoint.Detail)]
    public async Task<IActionResult> GetTourDetail(Guid id, [FromServices] ILanguageContext languageContext)
    {
        var result = await Sender.Send(new GetPublicTourDetailQuery(id, languageContext.CurrentLanguage));
        return HandleResult(result);
    }
}
