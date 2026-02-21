using Application.Common.Interfaces;
using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.Files;
// làm lại theo file could holder mới
public class FileManager : IFileManager
{
    private readonly ISeaweedClient _seaweedClient;
    private readonly IFileRepository _fileRepository;

    public FileManager(ISeaweedClient seaweedClient, IFileRepository fileRepository)
    {
        _seaweedClient = seaweedClient;
        _fileRepository = fileRepository;
    }

    public async Task<string> UploadFileAsync(
        Stream stream,
        string fileName,
        CancellationToken cancellationToken = default)
    {
        var assign =
            await _seaweedClient.AssignAsync(count: 1, collection: "QLMM", cancellationToken: cancellationToken);

        await _seaweedClient.UploadAsync(
            stream,
            fileName: $"{Guid.NewGuid()}{Path.GetExtension(fileName)}",
            uploadUrl: $"{assign.PublicUrl}/{assign.Fid}",
            cancellationToken);
        return $"{assign.PublicUrl}/{assign.Fid}";
    }

    public async Task<IEnumerable<FileMetadataEntity>> UploadMultipleFilesAsync(
        Guid entityId,
        (Stream Stream, string FileName, string ContentType, long Length)[] files,
        CancellationToken cancellationToken = default)
    {
        var assign = await _seaweedClient.AssignAsync(count: files.Length, collection: "QLMM",
            cancellationToken: cancellationToken);

        var fileMetadataList = new FileMetadataEntity[files.Length];
        var uploadTasks = new Task<UploadResponse>[files.Length];

        for (var i = 0; i < files.Length; i++)
        {
            var fId = i == 0 ? assign.Fid : $"{assign.Fid}_{i}";
            var extension = Path.GetExtension(files[i].FileName);

            fileMetadataList[i] = new FileMetadataEntity
            {
                LinkedEntityId = entityId,
                OriginalFileName = files[i].FileName,
                StoredFileName = $"{Guid.NewGuid()}{extension}",
                MimeType = files[i].ContentType,
                Url = $"{assign.PublicUrl}/{fId}",
                FileSize = files[i].Length
            };

            uploadTasks[i] = _seaweedClient.UploadAsync(
                files[i].Stream,
                fileName: fileMetadataList[i].StoredFileName,
                uploadUrl: $"{assign.PublicUrl}/{fId}",
                cancellationToken);
        }

        await Task.WhenAll(uploadTasks);
        var result = await _fileRepository.AddRange(fileMetadataList);
        if (result.IsError) throw new Exception(result.FirstError.Description);

        return fileMetadataList;
    }

    public async Task<Dictionary<Guid, FileMetadataEntity[]>> FindFiles(string[] entityIds)
    {
        var fileMetadatas = await _fileRepository.FindByLinkedEntityIds(entityIds);
        if (fileMetadatas.IsError) throw new Exception(fileMetadatas.FirstError.Description);

        return fileMetadatas
            .Value
            .GroupBy(file => file.LinkedEntityId)
            .ToDictionary(group => group.Key, group => group.ToArray());
    }

    public async Task DeleteMultipleFilesAsync(
        List<Guid> ids,
        CancellationToken cancellationToken = default)
    {
        var filesResult = await _fileRepository.FindByIds(ids);
        if (filesResult.IsError) throw new Exception(filesResult.FirstError.Description);

        var deleteTasks = filesResult.Value.Select(fileMetadata => _seaweedClient.DeleteAsync(
            fileMetadata.Url,
            cancellationToken));

        await Task.WhenAll(deleteTasks);
        var result = await _fileRepository.DeleteRange(ids);
        if (result.IsError) throw new Exception(result.FirstError.Description);
    }

    public Task<Stream> DownloadFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        return _seaweedClient.DownloadAsync(fileUrl, cancellationToken);
    }
}