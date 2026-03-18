using Application.Common.Interfaces;
using Contracts.Interfaces;
using Common.Models;
using Domain.Common.Repositories;
using Domain.Entities;
using ErrorOr;
using Infrastructure.Files;
using Microsoft.Extensions.Configuration;

namespace Domain.Specs.Infrastructure;

public sealed class FileManagerTests
{
    [Fact]
    public async Task DeleteMultipleFilesAsync_WhenIdsProvided_ShouldDeleteRangeWithoutThrowing()
    {
        var minio = new FakeMinIoCloudService();
        var repository = new FakeFileRepository();
        var configuration = new ConfigurationBuilder().Build();
        var manager = new FileManager(minio, configuration, repository);
        var ids = new List<Guid> { Guid.CreateVersion7(), Guid.CreateVersion7() };

        var exception = await Record.ExceptionAsync(() => manager.DeleteMultipleFilesAsync(ids));

        Assert.Null(exception);
        Assert.True(repository.DeleteRangeCalled);
        Assert.Equal(ids, repository.CapturedDeleteIds);
    }

    [Fact]
    public async Task UploadMultipleFilesAsync_ShouldDisposeInputStreams()
    {
        var minio = new FakeMinIoCloudService
        {
            UploadResult =
            [
                new UploadFileResult
                {
                    FileId = Guid.CreateVersion7().ToString(),
                    FileName = "stored-a.png",
                    OriginalFileName = "a.png",
                    PublicUrl = "https://cdn.example.com/a.png",
                    ContentType = "image/png",
                    FileSize = 4
                },
                new UploadFileResult
                {
                    FileId = Guid.CreateVersion7().ToString(),
                    FileName = "stored-b.png",
                    OriginalFileName = "b.png",
                    PublicUrl = "https://cdn.example.com/b.png",
                    ContentType = "image/png",
                    FileSize = 4
                }
            ]
        };
        var repository = new FakeFileRepository();
        var configuration = new ConfigurationBuilder().Build();
        var manager = new FileManager(minio, configuration, repository);

        var stream1 = new TrackingMemoryStream([1, 2, 3, 4]);
        var stream2 = new TrackingMemoryStream([5, 6, 7, 8]);
        var files = new (Stream Stream, string FileName, string ContentType, long Length)[]
        {
            (stream1, "a.png", "image/png", stream1.Length),
            (stream2, "b.png", "image/png", stream2.Length)
        };

        var result = await manager.UploadMultipleFilesAsync(Guid.CreateVersion7(), files);

        Assert.Equal(2, result.Count());
        Assert.True(stream1.IsDisposed);
        Assert.True(stream2.IsDisposed);
    }

    private sealed class TrackingMemoryStream(byte[] buffer) : MemoryStream(buffer)
    {
        public bool IsDisposed { get; private set; }

        protected override void Dispose(bool disposing)
        {
            IsDisposed = true;
            base.Dispose(disposing);
        }
    }

    private sealed class FakeMinIoCloudService : IMinIOCloudService
    {
        public List<UploadFileResult> UploadResult { get; set; } = [];

        public Task<List<UploadFileResult>> UploadFilesAsync(List<UploadFileBytes> files, string bucketName, bool isPublicBucket = false, CancellationToken ct = default)
        {
            return Task.FromResult(UploadResult);
        }

        public Task<string> GetShareLinkAsync(string bucketName, string objectName, int expireTime)
        {
            return Task.FromResult(string.Empty);
        }
    }

    private sealed class FakeFileRepository : IFileRepository
    {
        public bool DeleteRangeCalled { get; private set; }
        public List<Guid> CapturedDeleteIds { get; private set; } = [];

        public Task<ErrorOr<Success>> AddRange(FileMetadataEntity[] fileMetadatas)
        {
            return Task.FromResult<ErrorOr<Success>>(Result.Success);
        }

        public Task<ErrorOr<List<FileMetadataEntity>>> FindByIds(IEnumerable<Guid> ids)
        {
            return Task.FromResult<ErrorOr<List<FileMetadataEntity>>>(new List<FileMetadataEntity>());
        }

        public Task<ErrorOr<List<FileMetadataEntity>>> FindByLinkedEntityIds(IEnumerable<string> ids)
        {
            return Task.FromResult<ErrorOr<List<FileMetadataEntity>>>(new List<FileMetadataEntity>());
        }

        public Task<ErrorOr<Success>> DeleteRange(List<Guid> ids)
        {
            DeleteRangeCalled = true;
            CapturedDeleteIds = ids;
            return Task.FromResult<ErrorOr<Success>>(Result.Success);
        }

        public Task<ErrorOr<Success>> DeleteByLinkedEntityId(Guid id)
        {
            return Task.FromResult<ErrorOr<Success>>(Result.Success);
        }
    }
}
