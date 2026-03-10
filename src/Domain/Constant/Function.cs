namespace Domain.Constant;

public class Function : Entity<int>
{
    public int CategoryId { get; set; }
    public string ApiUrl { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int Order { get; set; }
    public string ButtonShow { get; set; } = null!;
    public bool IsDeleted { get; set; }
}
