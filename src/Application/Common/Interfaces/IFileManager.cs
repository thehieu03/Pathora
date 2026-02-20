using Domain.Entities;

namespace Application.Common.Interfaces;

public interface IFileManager
{
    public Task<string> UploadFileAsync(
        Stream stream,
        string fileName,
        CancellationToken cancellationToken = default);

    public Task<IEnumerable<FileMetadata>> UploadMultipleFilesAsync(
        Guid entityId,
        (Stream Stream, string FileName, string ContentType, long Length)[] files,
        CancellationToken cancellationToken = default);

    public Task<Dictionary<Guid, FileMetadata[]>> FindFiles(string[] entityIds);

    public Task DeleteMultipleFilesAsync(
        List<Guid> ids,
        CancellationToken cancellationToken = default);

    public Task<Stream> DownloadFileAsync(
        string fileUrl,
        CancellationToken cancellationToken = default);
}