using Domain.Entities;

namespace Application.Common.Interfaces;

public interface IFileManager
{
    public Task<string> UploadFileAsync(
        Stream stream,
        string fileName,
        CancellationToken cancellationToken = default);

    public Task<IEnumerable<FileMetadataEntity>> UploadMultipleFilesAsync(
        Guid entityId,
        (Stream Stream, string FileName, string ContentType, long Length)[] files,
        CancellationToken cancellationToken = default);

    public Task<Dictionary<Guid, FileMetadataEntity[]>> FindFiles(string[] entityIds);

    public Task DeleteMultipleFilesAsync(
        List<Guid> ids,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes files from cloud storage by their public IDs.
    /// Used for rollback when an operation (e.g., tour creation) fails after files were uploaded.
    /// </summary>
    public Task DeleteUploadedFilesAsync(List<string> objectNames, CancellationToken cancellationToken = default);

    public Task<Stream> DownloadFileAsync(
        string fileUrl,
        CancellationToken cancellationToken = default);
}

