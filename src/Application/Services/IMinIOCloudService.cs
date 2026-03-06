using Common.Models;

namespace Application.Common.Interfaces;

public interface IMinIOCloudService
{
    Task<List<UploadFileResult>> UploadFilesAsync(
        List<UploadFileBytes> files,
        string bucketName,
        bool isPublicBucket = false,
        CancellationToken ct = default);
    Task<string> GetShareLinkAsync(string bucketName, string objectName, int expireTime);
}

