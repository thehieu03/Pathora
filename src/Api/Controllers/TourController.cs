using System.Text.Json;

using Api.Endpoint;
using Application.Common.Constant;
using Application.Common.Interfaces;
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
public class TourController(IFileService fileService, IFileManager fileManager) : BaseApiController
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
        [FromForm] string? classifications = null,
        [FromForm] string? accommodations = null,
        [FromForm] string? locations = null,
        [FromForm] string? transportations = null,
        [FromForm] Guid? visaPolicyId = null,
        [FromForm] Guid? depositPolicyId = null,
        [FromForm] Guid? pricingPolicyId = null,
        [FromForm] Guid? cancellationPolicyId = null)
    {
        var thumbnailDto = thumbnail is not null ? await UploadSingleFile(thumbnail) : null;
        var imageDtos = images is not null && images.Count > 0
            ? await UploadFiles(images)
            : null;
        var translationData = ParseTranslations(translations);
        var classificationData = ParseClassifications(classifications);
        var accommodationData = ParseAccommodations(accommodations);
        var locationData = ParseLocations(locations);
        var transportationData = ParseTransportations(transportations);

        // Collect all uploaded object names for rollback on failure
        var uploadedObjectNames = new List<string>();
        if (thumbnailDto?.FileId is not null)
            uploadedObjectNames.Add(thumbnailDto.FileId);
        if (imageDtos is not null)
            uploadedObjectNames.AddRange(imageDtos.Select(i => i.FileId).Where(id => !string.IsNullOrEmpty(id)));

        try
        {
            var command = new CreateTourCommand(
                tourName,
                shortDescription ?? string.Empty,
                longDescription ?? string.Empty,
                seoTitle,
                seoDescription,
                status,
                thumbnailDto,
                imageDtos,
                translationData,
                classificationData,
                accommodationData,
                locationData,
                transportationData,
                visaPolicyId,
                depositPolicyId,
                pricingPolicyId,
                cancellationPolicyId);

            var result = await Sender.Send(command);
            return HandleResult(result);
        }
        catch
        {
            // Rollback: delete any files that were uploaded before the command failed
            if (uploadedObjectNames.Count > 0)
            {
                try
                {
                    await fileManager.DeleteUploadedFilesAsync(uploadedObjectNames);
                }
                catch
                {
                    // Log but don't mask the original exception
                }
            }
            throw;
        }
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
            using var document = JsonDocument.Parse(translations);
            if (document.RootElement.ValueKind != JsonValueKind.Object)
            {
                return null;
            }

            var result = new Dictionary<string, TourTranslationData>(StringComparer.OrdinalIgnoreCase);

            foreach (var languageProperty in document.RootElement.EnumerateObject())
            {
                if (languageProperty.Value.ValueKind != JsonValueKind.Object)
                {
                    continue;
                }

                var translation = new TourTranslationData
                {
                    TourName = GetStringProperty(languageProperty.Value, "tourName", "description"),
                    ShortDescription = GetStringProperty(languageProperty.Value, "shortDescription"),
                    LongDescription = GetStringProperty(languageProperty.Value, "longDescription"),
                    SEOTitle = GetNullableStringProperty(languageProperty.Value, "seoTitle", "sEOTitle"),
                    SEODescription = GetNullableStringProperty(languageProperty.Value, "seoDescription", "sEODescription")
                };

                result[languageProperty.Name] = translation;
            }

            return result;
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static string GetStringProperty(JsonElement element, params string[] propertyNames)
    {
        return GetNullableStringProperty(element, propertyNames) ?? string.Empty;
    }

    private static string? GetNullableStringProperty(JsonElement element, params string[] propertyNames)
    {
        foreach (var propertyName in propertyNames)
        {
            if (!TryGetPropertyIgnoreCase(element, propertyName, out var propertyValue))
            {
                continue;
            }

            if (propertyValue.ValueKind == JsonValueKind.Null)
            {
                return null;
            }

            if (propertyValue.ValueKind == JsonValueKind.String)
            {
                return propertyValue.GetString();
            }

            return propertyValue.ToString();
        }

        return null;
    }

    private static bool TryGetPropertyIgnoreCase(JsonElement element, string propertyName, out JsonElement propertyValue)
    {
        foreach (var candidate in element.EnumerateObject())
        {
            if (string.Equals(candidate.Name, propertyName, StringComparison.OrdinalIgnoreCase))
            {
                propertyValue = candidate.Value;
                return true;
            }
        }

        propertyValue = default;
        return false;
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

    private static List<AccommodationDto>? ParseAccommodations(string? accommodations)
    {
        if (string.IsNullOrWhiteSpace(accommodations))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<List<AccommodationDto>>(
                accommodations,
                TranslationJsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static List<LocationDto>? ParseLocations(string? locations)
    {
        if (string.IsNullOrWhiteSpace(locations))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<List<LocationDto>>(
                locations,
                TranslationJsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static List<TransportationDto>? ParseTransportations(string? transportations)
    {
        if (string.IsNullOrWhiteSpace(transportations))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<List<TransportationDto>>(
                transportations,
                TranslationJsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
