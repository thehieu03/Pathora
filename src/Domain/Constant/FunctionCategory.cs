namespace Domain.Constant;

public sealed class FunctionCategory : Entity<int>
{
    public string Identity { get; set; } = null!;
    public string Description { get; set; } = null!;
}