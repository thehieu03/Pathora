using System.Text.Json;

using Api.Endpoint;
using Application.Common.Constant;
using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Features.Tour.Queries;
using Application.Services;
using Domain.Entities.Translations;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize(Roles = RoleConstants.SuperAdmin_Admin_TourManager_TourOperator)]
[Route(TourEndpoint.Base)]
public class TourController(IFileService fileService) : BaseApiController
{
    private static readonly JsonSerializerOptions TranslationJsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private static readonly JsonSerializerOptions ClassificationJsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
    };

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? searchText,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await Sender.Send(new GetAllToursQuery(searchText, pageNumber, pageSize));
        return HandleResult(result);
    }

    [HttpGet(TourEndpoint.Id)]
    public async Task<IActionResult> GetDetail(Guid id)
    {
        var result = await Sender.Send(new GetTourDetailQuery(id));
        return HandleResult(result);
    }

    [HttpGet(TourEndpoint.ClassificationPricingTiers)]
    public async Task<IActionResult> GetClassificationPricingTiers(Guid classificationId)
    {
        var result = await Sender.Send(new GetClassificationPricingTiersQuery(classificationId));
        return HandleResult(result);
    }

    [HttpPut(TourEndpoint.ClassificationPricingTiers)]
    public async Task<IActionResult> UpsertClassificationPricingTiers(Guid classificationId, [FromBody] List<DynamicPricingDto> tiers)
    {
        var result = await Sender.Send(new UpsertClassificationPricingTiersCommand(classificationId, tiers));
        return HandleUpdated(result);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create(
        [FromForm] string tourName,
        [FromForm] string shortDescription,
        [FromForm] string longDescription,
        [FromForm] string? seoTitle,
        [FromForm] string? seoDescription,
        [FromForm] TourStatus status,
        IFormFile? thumbnail,
        [FromForm] List<IFormFile>? images,
        [FromForm] string? translations = null,
        [FromForm] string? classifications = null)
    {
        var thumbnailDto = thumbnail is not null ? await UploadSingleFile(thumbnail) : null;
        var imageDtos = images is not null && images.Count > 0
            ? await UploadFiles(images)
            : null;
        var translationData = ParseTranslations(translations);
        var classificationData = ParseClassifications(classifications);

        var command = new CreateTourCommand(
            tourName, shortDescription, longDescription,
            seoTitle, seoDescription, status, thumbnailDto, imageDtos, translationData, classificationData);

        var result = await Sender.Send(command);
        return HandleResult(result);
    }

    [HttpPut]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(
        [FromForm] Guid id,
        [FromForm] string tourName,
        [FromForm] string shortDescription,
        [FromForm] string longDescription,
        [FromForm] string? seoTitle,
        [FromForm] string? seoDescription,
        [FromForm] TourStatus status,
        IFormFile? thumbnail,
        [FromForm] List<IFormFile>? images,
        [FromForm] string? translations = null)
    {
        var thumbnailDto = thumbnail is not null ? await UploadSingleFile(thumbnail) : null;
        var imageDtos = images is not null && images.Count > 0
            ? await UploadFiles(images)
            : null;
        var translationData = ParseTranslations(translations);

        var command = new UpdateTourCommand(
            id, tourName, shortDescription, longDescription,
            seoTitle, seoDescription, status, thumbnailDto, imageDtos, translationData);

        var result = await Sender.Send(command);
        return HandleResult(result);
    }

    [HttpDelete(TourEndpoint.Id)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await Sender.Send(new DeleteTourCommand(id));
        return HandleResult(result);
    }

    private async Task<ImageInputDto> UploadSingleFile(IFormFile file)
    {
        await using var stream = file.OpenReadStream();
        var meta = await fileService.UploadFileAsync(
            new Application.Contracts.File.UploadFileRequest(
                stream, file.FileName, file.ContentType ?? "application/octet-stream", file.Length));
        return new ImageInputDto(meta.Id.ToString(), meta.Name, meta.Name, meta.Url);
    }

    private async Task<List<ImageInputDto>> UploadFiles(List<IFormFile> files)
    {
        var result = new List<ImageInputDto>();
        foreach (var file in files)
        {
            result.Add(await UploadSingleFile(file));
        }
        return result;
    }

    private static Dictionary<string, TourTranslationData>? ParseTranslations(string? translations)
    {
        if (string.IsNullOrWhiteSpace(translations))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, TourTranslationData>>(
                translations,
                TranslationJsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static List<ClassificationDto>? ParseClassifications(string? classifications)
    {
        if (string.IsNullOrWhiteSpace(classifications))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<List<ClassificationDto>>(
                classifications,
                ClassificationJsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
