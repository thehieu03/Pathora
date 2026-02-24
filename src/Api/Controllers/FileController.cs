using Api.Endpoint;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Authorize]
[Route(FileEndpoint.Base)]
public class FileController : BaseApiController
{
    private readonly IFileService _fileService;

    public FileController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpPost(FileEndpoint.Upload)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file.Length == 0)
            return BadRequest("File is empty");

        await using var stream = file.OpenReadStream();
        var url = await _fileService.UploadFileAsync(
            new Application.Contracts.File.UploadFileRequest(stream, file.FileName));
        return Ok(new { Url = url });
    }

    [HttpPost(FileEndpoint.UploadMultiple)]
    public async Task<IActionResult> UploadMultiple([FromForm] Guid entityId, [FromForm] List<IFormFile> files)
    {
        if (files.Count == 0)
            return BadRequest("No files provided");

        var fileDataList = files.Select(f =>
            new Application.Contracts.File.FileData(f.OpenReadStream(), f.FileName, f.ContentType, f.Length)).ToList();

        var result = await _fileService.UploadMultipleFilesAsync(
            new Application.Contracts.File.UploadMultipleFilesRequest(entityId, fileDataList));

        return Ok(result);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete([FromBody] Application.Contracts.File.DeleteMultipleFilesRequest request)
    {
        await _fileService.DeleteMultipleFilesAsync(request);
        return Ok();
    }
}
