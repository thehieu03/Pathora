using Api.Endpoint;
using Domain.Common.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Api.Controllers;

[ApiController]
[Route(SiteContentEndpoint.Base)]
public class SiteContentController : ControllerBase
{
    private readonly ISiteContentRepository _repository;
    private readonly ILogger<SiteContentController> _logger;
    private const string CacheKey = "site_content_page_";

    public SiteContentController(ISiteContentRepository repository, ILogger<SiteContentController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Get all content for a specific page
    /// </summary>
    [HttpGet]
    [ResponseCache(Duration = 300, VaryByQueryKeys = new[] { "pageKey" })]
    public async Task<IActionResult> GetByPage([FromQuery] string pageKey)
    {
        if (string.IsNullOrWhiteSpace(pageKey))
            return BadRequest(new { error = "pageKey is required" });

        _logger.LogInformation("Fetching site content for page: {PageKey}", pageKey);
        var content = await _repository.GetByPageKeyAsync(pageKey);

        var result = content.ToDictionary(c => c.ContentKey, c => JsonSerializer.Deserialize<object>(c.ContentValue));
        return Ok(new { items = result });
    }

    /// <summary>
    /// Get specific content item by page and content key
    /// </summary>
    [HttpGet(SiteContentEndpoint.ByKey)]
    [ResponseCache(Duration = 300)]
    public async Task<IActionResult> GetByKey(string pageKey, string contentKey)
    {
        if (string.IsNullOrWhiteSpace(pageKey) || string.IsNullOrWhiteSpace(contentKey))
            return BadRequest(new { error = "pageKey and contentKey are required" });

        var content = await _repository.GetByPageAndContentKeyAsync(pageKey, contentKey);
        if (content == null)
            return NotFound(new { error = "Content not found" });

        var deserialized = JsonSerializer.Deserialize<object>(content.ContentValue);
        return Ok(new { key = content.ContentKey, value = deserialized });
    }

    /// <summary>
    /// Update or create content (admin only - requires authorization)
    /// </summary>
    [HttpPut(SiteContentEndpoint.ByKey)]
    [Authorize]
    public async Task<IActionResult> Upsert(string pageKey, string contentKey, [FromBody] UpsertSiteContentRequest request)
    {
        if (string.IsNullOrWhiteSpace(pageKey) || string.IsNullOrWhiteSpace(contentKey))
            return BadRequest(new { error = "pageKey and contentKey are required" });

        if (string.IsNullOrWhiteSpace(request.ContentValue))
            return BadRequest(new { error = "contentValue is required" });

        _logger.LogInformation("Updating site content for {PageKey}/{ContentKey} by user {UserId}",
            pageKey, contentKey, CurrentUserId);

        var result = await _repository.UpsertAsync(pageKey, contentKey, request.ContentValue, CurrentUserId);
        return result.IsError
            ? BadRequest(new { error = result.FirstError.Description })
            : Ok(result.Value);
    }

    private string CurrentUserId => User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "system";
}

public record UpsertSiteContentRequest(string ContentValue);
