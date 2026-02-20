namespace Domain.Entities;

public sealed class RefreshToken : Entity<Guid>
{
    public RefreshToken()
    {
        Id = Guid.CreateVersion7();
    }

    public Guid UserId { get; set; }
    public string Token { get; set; } = null!;
    public DateTime ExpiresOnUtc { get; set; }
    public bool IsActive => DateTime.UtcNow < ExpiresOnUtc;
}