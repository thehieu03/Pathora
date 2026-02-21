using Domain.Abstractions;

namespace Domain.Entities;

public sealed class RoleEntity : Aggregate<Guid>
{
    public RoleEntity()
    {
        Id = Guid.CreateVersion7();
    }

    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int Type { get; set; }
    public RoleStatus Status { get; set; } = RoleStatus.Active;
    public bool IsDeleted { get; set; }
}