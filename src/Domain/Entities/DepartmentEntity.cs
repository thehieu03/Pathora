namespace Domain.Entities;

public sealed class DepartmentEntity : Aggregate<Guid>
{
    public DepartmentEntity()
    {
        Id = Guid.CreateVersion7();
    }

    public Guid? ParentId { get; set; }
    public string Name { get; set; } = null!;
    public int Level { get; set; } = 1;
    public bool IsDeleted { get; set; }
}