namespace Domain.Entities;

public sealed class ImageEntity
{
    public string? FileId { get; set; }
    public string? OriginalFileName { get; set; }
    public string? FileName { get; set; }
    public string? PublicURL { get; set; }

}
