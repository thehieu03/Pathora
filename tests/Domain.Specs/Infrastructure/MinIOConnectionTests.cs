using Minio;
using Minio.DataModel.Args;

namespace Domain.Specs.Infrastructure;

/// <summary>
/// Integration tests that verify the MinIO server is reachable and credentials are valid.
/// These tests connect to the REAL MinIO server configured in appsettings.
/// They are opt-in via the MINIO_TEST_ENABLED environment variable to avoid failing
/// in CI where MinIO may not be available.
/// Set MINIO_TEST_ENABLED=1 to run these tests.
/// </summary>
public sealed class MinIOConnectionTests
{
    private const string EnvEnabled = "MINIO_TEST_ENABLED";
    private const string EnvEndpoint = "MinIO:Endpoint";
    private const string EnvAccessKey = "MinIO:AccessKey";
    private const string EnvSecretKey = "MinIO:SecretKey";
    private const string EnvBucket = "MinIO:DefaultBucket";

    private static bool IsEnabled => !string.IsNullOrEmpty(Environment.GetEnvironmentVariable(EnvEnabled));

    private IMinioClient BuildClient()
    {
        var endpoint = Environment.GetEnvironmentVariable(EnvEndpoint) ?? "34.143.220.132:9000";
        var accessKey = Environment.GetEnvironmentVariable(EnvAccessKey) ?? "minioadmin";
        var secretKey = Environment.GetEnvironmentVariable(EnvSecretKey) ?? "do-an_GPathora";

        return new MinioClient()
            .WithEndpoint(endpoint)
            .WithCredentials(accessKey, secretKey)
            .WithSSL(false)
            .Build();
    }

    private static string GetBucket() =>
        Environment.GetEnvironmentVariable(EnvBucket) ?? "panthora";

    [Fact]
    public async Task Connect_WhenServerReachable_ShouldListBuckets()
    {
        if (!IsEnabled) return;

        var client = BuildClient();
        var buckets = await client.ListBucketsAsync();

        Assert.NotNull(buckets);
    }

    [Fact]
    public async Task BucketExists_WhenPanthoraBucketExists_ShouldReturnTrue()
    {
        if (!IsEnabled) return;

        var client = BuildClient();
        var bucketName = GetBucket();

        var exists = await client.BucketExistsAsync(
            new BucketExistsArgs().WithBucket(bucketName));

        Assert.True(exists,
            $"Bucket '{bucketName}' does not exist on MinIO server. "
            + "This causes NullReferenceException in MinIO SDK when uploading. "
            + "Fix: create the bucket or ensure MinIO is accessible.");
    }

    [Fact]
    public async Task Upload_WhenBucketExists_ShouldSucceed()
    {
        if (!IsEnabled) return;

        var client = BuildClient();
        var bucketName = GetBucket();

        // Verify bucket exists first
        var exists = await client.BucketExistsAsync(
            new BucketExistsArgs().WithBucket(bucketName));
        Assert.True(exists, $"Bucket '{bucketName}' must exist before upload");

        // Upload a small test file
        var objectName = $"test-{Guid.NewGuid()}.txt";
        var data = "MinIO connection test"u8.ToArray();
        await using var stream = new MemoryStream(data);

        await client.PutObjectAsync(
            new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(data.Length)
                .WithContentType("text/plain"));

        // Cleanup
        await client.RemoveObjectAsync(
            new RemoveObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName));
    }

    [Fact]
    public async Task Upload_WhenServerUnreachable_ShouldThrowDescriptiveException()
    {
        if (!IsEnabled) return;

        // Create a client pointing to a fake endpoint to simulate unreachable
        var fakeClient = new MinioClient()
            .WithEndpoint("192.0.2.1:9000") // TEST-NET address, guaranteed unreachable
            .WithCredentials("fake", "fake")
            .WithSSL(false)
            .Build();

        var data = "test"u8.ToArray();
        await using var stream = new MemoryStream(data);

        var ex = await Assert.ThrowsAnyAsync<Exception>(() =>
            fakeClient.PutObjectAsync(
                new PutObjectArgs()
                    .WithBucket(GetBucket())
                    .WithObject("test.txt")
                    .WithStreamData(stream)
                    .WithObjectSize(data.Length)
                    .WithContentType("text/plain")));

        // Verify the exception has a meaningful message (not NullReferenceException from SDK bug)
        Assert.False(ex is NullReferenceException,
            $"MinIO SDK threw NullReferenceException instead of a descriptive error. "
            + $"This is the bug: '{ex.Message}'");
        Assert.NotEmpty(ex.Message);
    }
}
