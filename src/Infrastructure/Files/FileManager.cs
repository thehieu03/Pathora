using Application.Common.Interfaces;
using Domain.Entities;

namespace Infrastructure.Files;
// làm lại theo file could holder mới
public class FileManager : IFileManager
{
    public Task DeleteMultipleFilesAsync(List<Guid> ids, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<Stream> DownloadFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<Dictionary<Guid, FileMetadataEntity[]>> FindFiles(string[] entityIds)
    {
        throw new NotImplementedException();
    }

    public Task<string> UploadFileAsync(Stream stream, string fileName, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<FileMetadataEntity>> UploadMultipleFilesAsync(Guid entityId, (Stream Stream, string FileName, string ContentType, long Length)[] files, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}

