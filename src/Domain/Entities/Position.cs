namespace Domain.Entities;

public sealed class Position : AuditableEntity<Guid>
{
    public Position()
    {
        Id = Guid.CreateVersion7();
    }

    public string Name { get; set; } = null!;
    public int Level { get; set; } = 1;
    public string? Note { get; set; }
    public bool IsDeleted { get; set; }
    public int? Type { get; set; }
}