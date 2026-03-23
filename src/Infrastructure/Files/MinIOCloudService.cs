using System.Net;
using System.Text.Json;
using Application.Common.Interfaces;
using Common.Models;
using Contracts.Interfaces;
using Infrastructure.Exceptions;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;

namespace Infrastructure.Files;

public sealed class MinIOCloudService : IMinIOCloudService
{
    private readonly IMinioClient _minioClient;
    private readonly string _publicBaseUrl;
    private readonly string _defaultBucket;

    public MinIOCloudService(IMinioClient minioClient, IConfiguration configuration)
    {
        _minioClient = minioClient;
        _defaultBucket = configuration["MinIO:DefaultBucket"] ?? "panthora";

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
            var args = new PresignedGetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithExpiry(expireTime * 60);
            return await _minioClient.PresignedGetObjectAsync(args);
        }
        catch (Exception ex)
        {
            throw WrapMinIOException(ex, "GetShareLink", bucketName, objectName);
        }
    }

    public async Task<List<UploadFileResult>> UploadFilesAsync(
        List<UploadFileBytes> files,
        string bucketName,
        bool isPublicBucket = false,
        CancellationToken ct = default)
    {
        var results = new List<UploadFileResult>();
        if (files is null || files.Count == 0)
        {
            return results;
        }

        try
        {
            await EnsureBucketAsync(bucketName, isPublicBucket, ct);

            foreach (var f in files)
            {
                var fileCloudId = Guid.NewGuid();
                var ext = Path.GetExtension(f.FileName);
                var objectName = $"{fileCloudId}{ext}";
                using var stream = new MemoryStream(f.Bytes, 0, f.Bytes.Length, writable: false, publiclyVisible: true);
                var putArgs = new PutObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectName)
                    .WithStreamData(stream)
                    .WithObjectSize(f.Bytes.Length)
                    .WithContentType(f.ContentType);
                await _minioClient.PutObjectAsync(putArgs, ct);
                results.Add(new UploadFileResult
                {
                    FileId = fileCloudId.ToString(),
                    FolderName = bucketName,
                    OriginalFileName = f.FileName,
                    FileName = objectName,
                    FileSize = f.Bytes.Length,
                    ContentType = f.ContentType,
                    PublicUrl = isPublicBucket ? $"{_publicBaseUrl}/{bucketName}/{objectName}" : string.Empty,
                });
            }
            return results;
        }
        catch (Exception ex)
        {
            throw WrapMinIOException(ex, "UploadFiles", bucketName);
        }
    }

    public async Task DeleteFilesAsync(string bucketName, List<string> objectNames, CancellationToken ct = default)
    {
        if (objectNames.Count == 0) return;

        try
        {
            foreach (var objectName in objectNames)
            {
                await _minioClient.RemoveObjectAsync(
                    new RemoveObjectArgs()
                        .WithBucket(bucketName)
                        .WithObject(objectName), ct);
            }
        }
        catch (Exception ex)
        {
            throw WrapMinIOException(ex, "DeleteFiles", bucketName);
        }
    }

    private async Task EnsureBucketAsync(string bucketName, bool isPublicBucket, CancellationToken ct)
    {
        try
        {
            var exists = await _minioClient
                .BucketExistsAsync(new BucketExistsArgs().WithBucket(bucketName), ct);

            if (!exists)
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
                    var policyJson = JsonSerializer.Serialize(policy);
                    await _minioClient.SetPolicyAsync(
                        new SetPolicyArgs()
                            .WithBucket(bucketName)
                            .WithPolicy(policyJson), ct);
                }
            }
        }
        catch (Exception ex)
        {
            throw WrapMinIOException(ex, "EnsureBucket", bucketName);
        }
    }

    private static Exception WrapMinIOException(Exception ex, string operation, string bucketName, string? objectName = null)
    {
        // NullReferenceException from MinIO SDK usually means:
        // - Server returned an incomplete/malformed HTTP response (network issue)
        // - Timeout or connection reset
        // - Credentials rejected (server closed connection)
        if (ex is NullReferenceException)
        {
            var details = string.IsNullOrEmpty(objectName)
                ? $"MinIO operation '{operation}' failed for bucket '{bucketName}'. Server returned an invalid response (network issue or unreachable)."
                : $"MinIO operation '{operation}' failed for bucket '{bucketName}', object '{objectName}'. Server returned an invalid response (network issue or unreachable).";
            return new InfrastructureException(details, ex);
        }

        // Detect common HTTP-level errors
        var message = ex.Message;

        if (ex is HttpRequestException or System.IO.IOException)
        {
            var details = string.IsNullOrEmpty(objectName)
                ? $"MinIO operation '{operation}' failed: cannot connect to MinIO server. Check that the server is running and credentials are correct. Error: {message}"
                : $"MinIO operation '{operation}' failed for bucket '{bucketName}', object '{objectName}': cannot connect to MinIO server. Error: {message}";
            return new InfrastructureException(details, ex);
        }

        if (message.Contains("AccessDenied", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("InvalidAccessKeyId", StringComparison.OrdinalIgnoreCase))
        {
            var details = $"MinIO credentials are invalid. Please check your AccessKey and SecretKey configuration. Error: {message}";
            return new InfrastructureException(details, ex);
        }

        if (message.Contains("No such bucket", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("bucket not found", StringComparison.OrdinalIgnoreCase))
        {
            var details = $"MinIO bucket '{bucketName}' does not exist. Error: {message}";
            return new InfrastructureException(details, ex);
        }

        if (message.Contains("timed out", StringComparison.OrdinalIgnoreCase) ||
            message.Contains("timeout", StringComparison.OrdinalIgnoreCase))
        {
            var details = $"MinIO operation '{operation}' timed out. The server may be overloaded or unreachable. Error: {message}";
            return new InfrastructureException(details, ex);
        }

        // Default: wrap with context
        var context = string.IsNullOrEmpty(objectName)
            ? $"MinIO operation '{operation}' on bucket '{bucketName}' failed"
            : $"MinIO operation '{operation}' on bucket '{bucketName}', object '{objectName}' failed";
        return new InfrastructureException($"{context}. Error: {message}", ex);
    }
}

