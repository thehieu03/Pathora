using Domain.Abstractions;

namespace Domain.Entities;

public sealed class UserEntity : Aggregate<Guid>
{
    public UserEntity()
    {
        Id = Guid.CreateVersion7();
    }

    public string Username { get; set; } = null!;
    public string? FullName { get; set; }
    public string Email { get; set; } = null!;
    public string? Avatar { get; set; }

    public string Password { get; set; } = null!;
    public bool ForcePasswordChange { get; set; }
    public bool IsDeleted { get; set; }
}

