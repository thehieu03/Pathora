using Domain.Abstractions;

namespace Domain.Entities;

public sealed class RefreshTokenEntity : Aggregate<Guid>
{
    public RefreshTokenEntity()
    {
        Id = Guid.CreateVersion7();
    }

    public Guid UserId { get; set; }
    public string Token { get; set; } = null!;
    public DateTimeOffset ExpiresOnUtc { get; set; }
    public bool IsActive => DateTimeOffset.UtcNow < ExpiresOnUtc;
}

