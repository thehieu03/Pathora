using Application.Common.Interfaces;
using Application.Contracts.File;

namespace Application.Services;

public interface IFileService
{
    Task<string> UploadFileAsync(UploadFileRequest request);
    Task<IEnumerable<FileMetadataVm>> UploadMultipleFilesAsync(UploadMultipleFilesRequest request);
    Task DeleteMultipleFilesAsync(DeleteMultipleFilesRequest request);
}

public class FileService(IFileManager fileManager) : IFileService
{

    public Task<string> UploadFileAsync(UploadFileRequest request)
    {
        return fileManager.UploadFileAsync(request.Stream, request.FileName);
    }

    public async Task<IEnumerable<FileMetadataVm>> UploadMultipleFilesAsync(UploadMultipleFilesRequest request)
    {
        var uploadFiles = request.Files
            .Select(data => (data.Stream, data.FileName, data.ContentType, data.Length))
            .ToArray();
        var result = await fileManager.UploadMultipleFilesAsync(request.EntityId, uploadFiles);

        return result.Select(f => new FileMetadataVm(
            f.Id,
            f.Url,
            f.OriginalFileName,
            f.MimeType,
            f.FileSize));
    }

    public Task DeleteMultipleFilesAsync(DeleteMultipleFilesRequest request)
    {
        return fileManager.DeleteMultipleFilesAsync(request.FileIds);
    }
}