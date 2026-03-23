using Microsoft.Extensions.Diagnostics.HealthChecks;
using Minio;
using Minio.DataModel.Args;

namespace Api.Services;

public sealed class MinIOHealthCheck(
    IMinioClient minioClient,
    Microsoft.Extensions.Configuration.IConfiguration configuration)
    : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var bucketName = configuration["MinIO:DefaultBucket"] ?? "panthora";

        try
        {
            // Lightweight operation: list buckets
            await minioClient.ListBucketsAsync(cancellationToken);

            // Also verify the default bucket exists
            var bucketExists = await minioClient.BucketExistsAsync(
                new BucketExistsArgs().WithBucket(bucketName), cancellationToken);

            if (!bucketExists)
            {
                return HealthCheckResult.Unhealthy(
                    $"MinIO server is reachable but bucket '{bucketName}' does not exist.");
            }

            return HealthCheckResult.Healthy($"MinIO is healthy. Bucket '{bucketName}' is accessible.");
        }
        catch (Exception ex) when (ex is not NullReferenceException)
        {
            return HealthCheckResult.Unhealthy(
                $"MinIO is unreachable or credentials are invalid: {ex.Message}",
                exception: ex);
        }
        catch (Exception ex)
        {
            // NullReferenceException from MinIO SDK means the server returned
            // an incomplete/malformed response — treat as unhealthy
            return HealthCheckResult.Unhealthy(
                $"MinIO returned an invalid response (possible network issue): {ex.Message}",
                exception: ex);
        }
    }
}
