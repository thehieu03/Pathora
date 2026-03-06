using Application.Common.Interfaces;
using Contracts.Interfaces;
using Common.Models;
using Infrastructure.Exceptions;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;
using System.Text.Json;

namespace Infrastructure.Files;

public sealed class MinIOCloudService : IMinIOCloudService
{
    private readonly IMinioClient _minioClient;
    private readonly string _publicBaseUrl;
    public MinIOCloudService(IMinioClient minioClient, IConfiguration configuration)
    {
        _minioClient = minioClient;
        var publicUrl = configuration["MinIO:PublicUrl"];
        if (!string.IsNullOrEmpty(publicUrl))
        {
            _publicBaseUrl = publicUrl.TrimEnd('/');
        }
        else
        {
            var raw = minioClient.Config.Endpoint;
            var scheme = minioClient.Config.Secure ? "https" : "http";
            _publicBaseUrl = raw.StartsWith("http://") || raw.StartsWith("https://")
                ? raw.TrimEnd('/')
                : $"{scheme}://{raw.TrimEnd('/')}";
        }
    }
    public async Task<string> GetShareLinkAsync(string bucketName, string objectName, int expireTime)
    {
        try
        {
            var args=new PresignedGetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithExpiry(expireTime*60);
            return await _minioClient.PresignedGetObjectAsync(args);
        }
        catch (Exception ex)
        {

            throw new InfrastructureException(ex.Message);
        }
    }

    public async Task<List<UploadFileResult>> UploadFilesAsync(List<UploadFileBytes> files, string bucketName, bool isPublicBucket = false, CancellationToken ct = default)
    {
        var results= new List<UploadFileResult>();
        if(files is null || files.Count == 0)
        {
            return results;
        }
        try
        {
            await EnsureBucketAsync(bucketName, isPublicBucket, ct);
            foreach (var f in files)
            {
                var fileCloudId = Guid.NewGuid();
                var ext=Path.GetExtension(f.FileName);
                var objectName=$"{fileCloudId}{ext}";
                using var stream = new MemoryStream(f.Bytes, 0, f.Bytes.Length, writable: false, publiclyVisible: true);
                var putArgs=new PutObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectName)
                    .WithStreamData(stream)
                    .WithObjectSize(f.Bytes.Length)
                    .WithContentType(f.ContentType);
                var putResult=await _minioClient.PutObjectAsync(putArgs, ct);
                results.Add(new UploadFileResult
                {
                    FileId = fileCloudId.ToString(),
                    FolderName = bucketName,
                    OriginalFileName = f.FileName,
                    FileName=objectName,
                    FileSize=f.Bytes.Length,
                    ContentType=f.ContentType,
                    PublicURL=isPublicBucket?  $"{_publicBaseUrl}/{bucketName}/{objectName}" : string.Empty,
                });
            }
            return results;
        }
        catch (Exception ex)
        {
            throw new Exception("MinIOCloudService.UploadFilesAsync error", ex);
        }
    }

    private async Task EnsureBucketAsync(string bucketName, bool isPublicBucket, CancellationToken ct)
    {
        var exits = await _minioClient
            .BucketExistsAsync(new BucketExistsArgs().WithBucket(bucketName), ct);
        if (!exits)
        {
            await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName), ct);
            if (isPublicBucket)
            {
                var policy = new
                {
                    Version = "2012-10-17",
                    Statement = new[]
                    {
                        new
                        {
                            Effect = "Allow",
                            Principal = "*",
                            Action = new[] { "s3:GetObject" },
                            Resource = $"arn:aws:s3:::{bucketName}/*"
                        }
                    }
                };
                var policyJson=JsonSerializer.Serialize(policy);
                await _minioClient.SetPolicyAsync(
                        new SetPolicyArgs()
                        .WithBucket(bucketName)
                        .WithPolicy(policyJson), ct
                    );
            }
        }
    }
}
