using Domain.Common.Models;

namespace Application.Common.Interfaces;

public interface IMinIOCloudService
{
    // files: A list of files to be uploaded, each represented by an UploadFileBytes object.
    // bucketName: The name of the bucket where the files will be uploaded.
    // isPublicBucket: A boolean indicating whether the bucket is public or private. Default is false (private).
    Task<List<UploadFileResult>> UploadFilesAsync(
        List<UploadFileBytes> files,
        string bucketName,
        bool isPublicBucket = false,
        CancellationToken ct = default);
    // bucketName: The name of the bucket where the object is stored.
    // objectName: The name of the object for which the share link is to be generated.
    // expireTime: The time in seconds after which the share link will expire.
    Task<string> GetShareLinkAsync(string bucketName, string objectName, int expireTime);
}