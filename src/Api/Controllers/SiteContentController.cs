using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ErrorOr;
using Api.Endpoint;
using Contracts.Interfaces;
using Domain.Common.Repositories;
using Domain.Entities;

namespace Api.Controllers;

[ApiController]
[Route(SiteContentEndpoint.Base)]
public class SiteContentController : ControllerBase
{
    private readonly ISiteContentRepository _repository;
    private readonly ILogger<SiteContentController> _logger;

    public SiteContentController(ISiteContentRepository repository, ILogger<SiteContentController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Get all content for a specific page
    /// </summary>
    [HttpGet]
    [ResponseCache(Duration = 300, VaryByQueryKeys = new[] { "pageKey", "lang" })]
    public async Task<IActionResult> GetByPage(
        [FromQuery] string pageKey,
        [FromServices] ILanguageContext? languageContext = null)
    {
        if (string.IsNullOrWhiteSpace(pageKey))
        {
            return BadRequest(new { error = "pageKey is required" });
        }

        _logger.LogInformation("Fetching site content for page: {PageKey}", pageKey);
        var content = await _repository.GetByPageKeyAsync(pageKey);

        var language = languageContext?.CurrentLanguage;
        var result = content.ToDictionary(
            c => c.ContentKey,
            c => (object)SiteContentValueCodec.ResolveContentElement(c.ContentValue, language));

        return Ok(new { items = result });
    }

    /// <summary>
    /// Get specific content item by page and content key
    /// </summary>
    [HttpGet(SiteContentEndpoint.ByKey)]
    [ResponseCache(Duration = 300, VaryByQueryKeys = new[] { "lang" })]
    public async Task<IActionResult> GetByKey(
        string pageKey,
        string contentKey,
        [FromServices] ILanguageContext? languageContext = null)
    {
        if (string.IsNullOrWhiteSpace(pageKey) || string.IsNullOrWhiteSpace(contentKey))
        {
            return BadRequest(new { error = "pageKey and contentKey are required" });
        }

        var content = await _repository.GetByPageAndContentKeyAsync(pageKey, contentKey);
        if (content == null)
        {
            return NotFound(new { error = "Content not found" });
        }

        var resolved = SiteContentValueCodec.ResolveContentElement(content.ContentValue, languageContext?.CurrentLanguage);
        return Ok(new { key = content.ContentKey, value = resolved });
    }

    /// <summary>
    /// Get site content list for admin management table
    /// </summary>
    [HttpGet(SiteContentEndpoint.Admin)]
    [Authorize]
    public async Task<IActionResult> GetAdminList([FromQuery] string? pageKey, [FromQuery] string? search)
    {
        var items = await _repository.GetAdminListAsync(pageKey, search);

        var response = items
            .Select(item =>
            {
                var metadata = SiteContentValueCodec.GetMetadata(item.ContentValue);

                return new AdminSiteContentListItem(
                    item.Id,
                    item.PageKey,
                    item.ContentKey,
                    metadata.IsLocalized,
                    metadata.HasEnglish,
                    metadata.HasVietnamese,
                    item.LastModifiedOnUtc,
                    item.LastModifiedBy,
                    item.CreatedOnUtc,
                    item.CreatedBy);
            })
            .ToList();

        return Ok(new { items = response });
    }

    /// <summary>
    /// Get one site content record for admin editor
    /// </summary>
    [HttpGet(SiteContentEndpoint.AdminById)]
    [Authorize]
    public async Task<IActionResult> GetAdminById(Guid id)
    {
        var content = await _repository.GetByIdAsync(id);
        if (content is null)
        {
            return NotFound(new { error = "Content not found" });
        }

        var editableValues = SiteContentValueCodec.GetEditableValues(content.ContentValue);
        return Ok(new AdminSiteContentDetailItem(
            content.Id,
            content.PageKey,
            content.ContentKey,
            editableValues.EnglishContentValue,
            editableValues.VietnameseContentValue,
            editableValues.IsLocalized,
            editableValues.HasEnglish,
            editableValues.HasVietnamese,
            content.LastModifiedOnUtc,
            content.LastModifiedBy,
            content.CreatedOnUtc,
            content.CreatedBy));
    }

    /// <summary>
    /// Update or create content (admin only - requires authorization)
    /// </summary>
    [HttpPut(SiteContentEndpoint.ByKey)]
    [Authorize]
    public async Task<IActionResult> Upsert(string pageKey, string contentKey, [FromBody] UpsertSiteContentRequest request)
    {
        if (string.IsNullOrWhiteSpace(pageKey) || string.IsNullOrWhiteSpace(contentKey))
        {
            return BadRequest(new { error = "pageKey and contentKey are required" });
        }

        string contentValueToPersist;

        if (!string.IsNullOrWhiteSpace(request.EnglishContentValue) || !string.IsNullOrWhiteSpace(request.VietnameseContentValue))
        {
            if (string.IsNullOrWhiteSpace(request.EnglishContentValue) || string.IsNullOrWhiteSpace(request.VietnameseContentValue))
            {
                return BadRequest(new { error = "englishContentValue and vietnameseContentValue are required" });
            }

            if (!SiteContentValueCodec.TryCreateLocalizedContentValue(
                    request.EnglishContentValue,
                    request.VietnameseContentValue,
                    out contentValueToPersist,
                    out var localizedError))
            {
                return BadRequest(new { error = localizedError });
            }
        }
        else
        {
            if (string.IsNullOrWhiteSpace(request.ContentValue))
            {
                return BadRequest(new { error = "contentValue is required" });
            }

            if (!SiteContentValueCodec.TryNormalizeJson(request.ContentValue, out contentValueToPersist))
            {
                return BadRequest(new { error = "contentValue must be valid JSON" });
            }
        }

        _logger.LogInformation("Updating site content for {PageKey}/{ContentKey} by user {UserId}",
            pageKey, contentKey, CurrentUserId);

        var result = await _repository.UpsertAsync(pageKey, contentKey, contentValueToPersist, CurrentUserId);
        return result.IsError
            ? BadRequest(new { error = result.FirstError.Description })
            : Ok(result.Value);
    }

    /// <summary>
    /// Update content by id for admin editor
    /// </summary>
    [HttpPut(SiteContentEndpoint.AdminById)]
    [Authorize]
    public async Task<IActionResult> UpsertById(Guid id, [FromBody] UpdateAdminSiteContentRequest request)
    {
        if (!SiteContentValueCodec.TryCreateLocalizedContentValue(
                request.EnglishContentValue,
                request.VietnameseContentValue,
                out var contentValueToPersist,
                out var error))
        {
            return BadRequest(new { error });
        }

        var result = await _repository.UpsertByIdAsync(id, contentValueToPersist, CurrentUserId);
        if (result.IsError)
        {
            var firstError = result.FirstError;
            if (firstError.Type == ErrorType.NotFound)
            {
                return NotFound(new { error = firstError.Description });
            }

            return BadRequest(new { error = firstError.Description });
        }

        return Ok(result.Value);
    }

    private string CurrentUserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";
}

public sealed record UpsertSiteContentRequest(
    string? ContentValue,
    string? EnglishContentValue,
    string? VietnameseContentValue);

public sealed record UpdateAdminSiteContentRequest(
    string EnglishContentValue,
    string VietnameseContentValue);

public sealed record AdminSiteContentListItem(
    Guid Id,
    string PageKey,
    string ContentKey,
    bool IsLocalized,
    bool HasEnglish,
    bool HasVietnamese,
    DateTimeOffset? LastModifiedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset CreatedOnUtc,
    string? CreatedBy);

public sealed record AdminSiteContentDetailItem(
    Guid Id,
    string PageKey,
    string ContentKey,
    string EnglishContentValue,
    string VietnameseContentValue,
    bool IsLocalized,
    bool HasEnglish,
    bool HasVietnamese,
    DateTimeOffset? LastModifiedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset CreatedOnUtc,
    string? CreatedBy);
