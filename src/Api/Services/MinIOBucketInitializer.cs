using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;
using System.Text.Json;

namespace Api.Services;

/// <summary>
/// Initializes required MinIO buckets at application startup.
/// Creates the default bucket and any public buckets if they don't exist.
/// This ensures the first file upload doesn't fail due to a missing bucket.
/// </summary>
public sealed class MinIOBucketInitializer(
    IMinioClient minioClient,
    Microsoft.Extensions.Configuration.IConfiguration configuration,
    Serilog.ILogger logger)
    : IHostedService, IDisposable
{
    private readonly SemaphoreSlim _gate = new(1, 1);
    private bool _initialized;
    private CancellationTokenSource? _cts;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        await InitializeAsync(_cts.Token);
    }

    private async Task InitializeAsync(CancellationToken ct)
    {
        if (_initialized) return;

        await _gate.WaitAsync(ct);
        try
        {
            if (_initialized) return;

            var defaultBucket = configuration["MinIO:DefaultBucket"] ?? "panthora";
            var publicUrl = configuration["MinIO:PublicUrl"] ?? "";

            logger.Information("Initializing MinIO buckets. Default bucket: {Bucket}", defaultBucket);

            await EnsureBucketAsync(defaultBucket, isPublic: !string.IsNullOrEmpty(publicUrl), ct);

            _initialized = true;
            logger.Information("MinIO bucket initialization completed successfully.");
        }
        catch (Exception ex) when (ex is not NullReferenceException)
        {
            // Log but don't fail startup — file uploads will create the bucket on demand.
            // The health check will report unhealthy if MinIO is unreachable.
            logger.Warning(ex, "MinIO bucket initialization failed. Buckets will be created on first upload.");
        }
        catch (Exception ex)
        {
            logger.Warning(ex, "MinIO returned an invalid response during bucket initialization. Buckets will be created on first upload.");
        }
        finally
        {
            _gate.Release();
        }
    }

    private async Task EnsureBucketAsync(string bucketName, bool isPublic, CancellationToken ct)
    {
        var exists = await minioClient.BucketExistsAsync(
            new BucketExistsArgs().WithBucket(bucketName), ct);

        if (!exists)
        {
            logger.Information("Creating MinIO bucket: {Bucket}", bucketName);
            await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName), ct);
            logger.Information("Bucket '{Bucket}' created successfully.", bucketName);

            if (isPublic)
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
                await minioClient.SetPolicyAsync(
                    new SetPolicyArgs()
                        .WithBucket(bucketName)
                        .WithPolicy(policyJson), ct);
                logger.Information("Bucket '{Bucket}' configured as public.", bucketName);
            }
        }
        else
        {
            logger.Information("MinIO bucket '{Bucket}' already exists.", bucketName);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _cts?.Cancel();
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _gate.Dispose();
        _cts?.Dispose();
    }
}
