using Api.Endpoint;
using Application.Features.Public.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[AllowAnonymous]
[Route(PublicEndpoint.Base)]
public class PublicHomeController : BaseApiController
{
    [HttpGet(PublicEndpoint.Tours + "/" + PublicEndpoint.Featured)]
    public async Task<IActionResult> GetFeaturedTours([FromQuery] int limit = 8)
    {
        var result = await Sender.Send(new GetFeaturedToursQuery(limit));
        return HandleResult(result);
    }

    [HttpGet(PublicEndpoint.Tours + "/" + PublicEndpoint.Latest)]
    public async Task<IActionResult> GetLatestTours([FromQuery] int limit = 6)
    {
        var result = await Sender.Send(new GetLatestToursQuery(limit));
        return HandleResult(result);
    }

    [HttpGet(PublicEndpoint.Destinations + "/" + PublicEndpoint.Trending)]
    public async Task<IActionResult> GetTrendingDestinations([FromQuery] int limit = 6)
    {
        var result = await Sender.Send(new GetTrendingDestinationsQuery(limit));
        return HandleResult(result);
    }

    [HttpGet(PublicEndpoint.Attractions + "/" + PublicEndpoint.Top)]
    public async Task<IActionResult> GetTopAttractions([FromQuery] int limit = 8)
    {
        var result = await Sender.Send(new GetTopAttractionsQuery(limit));
        return HandleResult(result);
    }

    [HttpGet(PublicEndpoint.Stats)]
    public async Task<IActionResult> GetHomeStats()
    {
        var result = await Sender.Send(new GetHomeStatsQuery());
        return HandleResult(result);
    }

    [HttpGet(PublicEndpoint.Reviews + "/" + PublicEndpoint.Top)]
    public async Task<IActionResult> GetTopReviews([FromQuery] int limit = 6)
    {
        var result = await Sender.Send(new GetTopReviewsQuery(limit));
        return HandleResult(result);
    }

    [HttpGet(PublicEndpoint.Tours + "/" + PublicEndpoint.Search)]
    public async Task<IActionResult> SearchTours(
        [FromQuery] string? destination,
        [FromQuery] string? classification,
        [FromQuery] DateOnly? date,
        [FromQuery] int? people,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await Sender.Send(new SearchToursQuery(destination, classification, date, people, page, pageSize));
        return HandleResult(result);
    }

    [HttpGet(PublicEndpoint.Destinations)]
    public async Task<IActionResult> GetDestinations()
    {
        var result = await Sender.Send(new GetDestinationsQuery());
        return HandleResult(result);
    }
}
