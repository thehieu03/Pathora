namespace Domain.Entities;

public sealed class User : AuditableEntity<Guid>
{
    public User()
    {
        Id = Guid.CreateVersion7();
    }

    public string Username { get; set; }
    public string? FullName { get; set; }
    public string Email { get; set; }
    public string? Avatar { get; set; }

    public string Password { get; set; }
    public bool ForcePasswordChange { get; set; }
    public bool IsDeleted { get; set; }
}