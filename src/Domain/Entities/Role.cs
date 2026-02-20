namespace Domain.Entities;

public sealed class Role : AuditableEntity<Guid>
{
    public Role()
    {
        Id = Guid.CreateVersion7();
    }

    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int Type { get; set; }
    public RoleStatus Status { get; set; } = RoleStatus.Active;
    public bool IsDeleted { get; set; }
}