using Api.Endpoint;
using Application.Dtos;
using Application.Features.Tour.Commands;
using Application.Features.Tour.Queries;
using Application.Services;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[Route(TourEndpoint.Base)]
public class TourController(IFileService fileService) : BaseApiController
{
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

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create(
        [FromForm] string tourCode,
        [FromForm] string tourName,
        [FromForm] string shortDescription,
        [FromForm] string longDescription,
        [FromForm] string? seoTitle,
        [FromForm] string? seoDescription,
        [FromForm] TourStatus status,
        IFormFile? thumbnail,
        [FromForm] List<IFormFile>? images)
    {
        var thumbnailDto = thumbnail is not null ? await UploadSingleFile(thumbnail) : null;
        var imageDtos = images is not null && images.Count > 0
            ? await UploadFiles(images)
            : null;

        var command = new CreateTourCommand(
            tourCode, tourName, shortDescription, longDescription,
            seoTitle, seoDescription, status, thumbnailDto, imageDtos);

        var result = await Sender.Send(command);
        return HandleResult(result);
    }

    [HttpPut]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(
        [FromForm] Guid id,
        [FromForm] string tourCode,
        [FromForm] string tourName,
        [FromForm] string shortDescription,
        [FromForm] string longDescription,
        [FromForm] string? seoTitle,
        [FromForm] string? seoDescription,
        [FromForm] TourStatus status,
        IFormFile? thumbnail,
        [FromForm] List<IFormFile>? images)
    {
        var thumbnailDto = thumbnail is not null ? await UploadSingleFile(thumbnail) : null;
        var imageDtos = images is not null && images.Count > 0
            ? await UploadFiles(images)
            : null;

        var command = new UpdateTourCommand(
            id, tourCode, tourName, shortDescription, longDescription,
            seoTitle, seoDescription, status, thumbnailDto, imageDtos);

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
}
