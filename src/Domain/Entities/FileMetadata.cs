namespace Domain.Entities;

public sealed class FileMetadata : AuditableEntity<Guid>
{
    public FileMetadata()
    {
        Id = Guid.CreateVersion7();
    }

    public Guid LinkedEntityId { get; set; }
    public string OriginalFileName { get; set; } = null!;
    public string StoredFileName { get; set; } = null!;
    public string MimeType { get; set; } = null!;
    public string Url { get; set; } = null!;
    public long FileSize { get; set; }
    public bool IsDeleted { get; set; }
}