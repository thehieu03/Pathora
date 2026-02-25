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

    public static UserEntity Create(string username, string? fullName, string email, string hashedPassword, string performedBy, string? avatar = null, bool forcePasswordChange = false)
    {
        return new UserEntity
        {
            Username = username,
            FullName = fullName,
            Email = email,
            Avatar = avatar,
            Password = hashedPassword,
            ForcePasswordChange = forcePasswordChange,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    public void Update(string? fullName, string? avatar, string performedBy)
    {
        FullName = fullName;
        Avatar = avatar;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void ChangePassword(string hashedPassword, string performedBy, bool forcePasswordChange = false)
    {
        Password = hashedPassword;
        ForcePasswordChange = forcePasswordChange;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }

    public void SoftDelete(string performedBy)
    {
        IsDeleted = true;
        LastModifiedBy = performedBy;
        LastModifiedOnUtc = DateTimeOffset.UtcNow;
    }
}

