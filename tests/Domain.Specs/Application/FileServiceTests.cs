using Application.Common.Interfaces;
using Application.Contracts.File;
using Application.Services;
using Domain.Entities;

namespace Domain.Specs.Application;

public sealed class FileServiceTests
{
    [Fact]
    public async Task UploadFileAsync_WhenFileManagerReturnsNoMetadata_ShouldThrowClearException()
    {
        var manager = new FakeFileManager
        {
            UploadMultipleResult = []
        };
        var service = new FileService(manager);
        await using var stream = new MemoryStream([1, 2, 3]);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.UploadFileAsync(new UploadFileRequest(stream, "a.png", "image/png", stream.Length)));

        Assert.Equal("Uploaded file metadata was not returned.", exception.Message);
    }

    [Fact]
    public async Task UploadFileAsync_WhenFileManagerReturnsMetadata_ShouldMapResponse()
    {
        var fileId = Guid.CreateVersion7();
        var manager = new FakeFileManager
        {
            UploadMultipleResult =
            [
                FileMetadataEntity.Create(
                    Guid.Empty,
                    "avatar.png",
                    "stored-avatar.png",
                    "image/png",
                    "https://cdn.example.com/avatar.png",
                    1234,
                    "system")
            ]
        };
        var service = new FileService(manager);
        await using var stream = new MemoryStream([1, 2, 3]);

        var result = await service.UploadFileAsync(new UploadFileRequest(stream, "avatar.png", "image/png", stream.Length));

        Assert.Equal("https://cdn.example.com/avatar.png", result.Url);
        Assert.Equal("avatar.png", result.Name);
        Assert.Equal("image/png", result.Type);
    }

    private sealed class FakeFileManager : IFileManager
    {
        public IEnumerable<FileMetadataEntity> UploadMultipleResult { get; set; } = [];

        public Task<string> UploadFileAsync(Stream stream, string fileName, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(string.Empty);
        }

        public Task<IEnumerable<FileMetadataEntity>> UploadMultipleFilesAsync(
            Guid entityId,
            (Stream Stream, string FileName, string ContentType, long Length)[] files,
            CancellationToken cancellationToken = default)
        {
            return Task.FromResult(UploadMultipleResult);
        }

        public Task<Dictionary<Guid, FileMetadataEntity[]>> FindFiles(string[] entityIds)
        {
            return Task.FromResult(new Dictionary<Guid, FileMetadataEntity[]>());
        }

        public Task DeleteMultipleFilesAsync(List<Guid> ids, CancellationToken cancellationToken = default)
        {
            return Task.CompletedTask;
        }

        public Task<Stream> DownloadFileAsync(string fileUrl, CancellationToken cancellationToken = default)
        {
            return Task.FromResult<Stream>(new MemoryStream());
        }
    }
}
