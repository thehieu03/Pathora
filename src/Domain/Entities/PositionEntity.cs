using Domain.Abstractions;

namespace Domain.Entities;

public sealed class PositionEntity : Aggregate<Guid>
{
    public PositionEntity()
    {
        Id = Guid.CreateVersion7();
    }

    public string Name { get; set; } = null!;
    public int Level { get; set; } = 1;
    public string? Note { get; set; }
    public bool IsDeleted { get; set; }
    public int? Type { get; set; }
}

