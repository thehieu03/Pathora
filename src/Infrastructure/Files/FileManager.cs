using Application.Common.Interfaces;
using Common.Models;
using Domain.Common.Repositories;
using Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Files;

public class FileManager(
    IMinIOCloudService minIOCloudService,
    IConfiguration configuration,
    IFileRepository fileRepository) : IFileManager
{
    private string DefaultBucket => configuration["MinIO:DefaultBucket"] ?? "panthora";

    private static async Task<byte[]> ReadBytesAsync(Stream stream, CancellationToken ct)
    {
        using var ms = new MemoryStream();
        await stream.CopyToAsync(ms, ct);
        return ms.ToArray();
    }

    private static string GuessContentType(string fileName) =>
        Path.GetExtension(fileName).ToLowerInvariant() switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".pdf" => "application/pdf",
            _ => "application/octet-stream"
        };

    public async Task<string> UploadFileAsync(
        Stream stream,
        string fileName,
        CancellationToken cancellationToken = default)
    {
        var bytes = await ReadBytesAsync(stream, cancellationToken);
        var results = await minIOCloudService.UploadFilesAsync(
            [new UploadFileBytes { FileName = fileName, ContentType = GuessContentType(fileName), Bytes = bytes }],
            DefaultBucket,
            isPublicBucket: true,
            cancellationToken);
        return results.FirstOrDefault()?.PublicUrl ?? string.Empty;
    }

    public async Task<IEnumerable<FileMetadataEntity>> UploadMultipleFilesAsync(
        Guid entityId,
        (Stream Stream, string FileName, string ContentType, long Length)[] files,
        CancellationToken cancellationToken = default)
    {
        var uploadFiles = await Task.WhenAll(files.Select(async f =>
        {
            await using var stream = f.Stream;
            var bytes = await ReadBytesAsync(stream, cancellationToken);
            return new UploadFileBytes
            {
                FileName = f.FileName,
                ContentType = string.IsNullOrEmpty(f.ContentType) ? GuessContentType(f.FileName) : f.ContentType,
                Bytes = bytes
            };
        }));

        var results = await minIOCloudService.UploadFilesAsync(
            uploadFiles.ToList(),
            DefaultBucket,
            isPublicBucket: true,
            cancellationToken);

        return results.Select(r => FileMetadataEntity.Create(
            entityId,
            r.OriginalFileName ?? r.FileName ?? string.Empty,
            r.FileName ?? string.Empty,
            r.ContentType ?? "application/octet-stream",
            r.PublicUrl ?? string.Empty,
            r.FileSize,
            "system"));
    }

    public Task<Dictionary<Guid, FileMetadataEntity[]>> FindFiles(string[] entityIds)
        => throw new NotImplementedException();

    public async Task DeleteMultipleFilesAsync(List<Guid> ids, CancellationToken cancellationToken = default)
    {
        if (ids.Count == 0)
            return;

        var result = await fileRepository.DeleteRange(ids);
        if (result.IsError)
            throw new InvalidOperationException(result.FirstError.Description);
    }

    public async Task DeleteUploadedFilesAsync(List<string> objectNames, CancellationToken cancellationToken = default)
    {
        if (objectNames.Count == 0)
            return;

        await minIOCloudService.DeleteFilesAsync(DefaultBucket, objectNames, cancellationToken);
    }

    public Task<Stream> DownloadFileAsync(string fileUrl, CancellationToken cancellationToken = default)
        => throw new NotImplementedException();
}

