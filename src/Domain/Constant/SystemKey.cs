namespace Domain.Constant;

public sealed class SystemKey : Entity<int>
{
    public int ParentId { get; set; }
    public string CodeKey { get; set; }
    public int CodeValue { get; set; }
    public string Description { get; set; }
    public int SortOrder { get; set; }
    public bool IsDeleted { get; set; }
}