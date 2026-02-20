namespace Domain.Constant;

public sealed class Function : Entity<int>
{
    public int CategoryId { get; set; }
    public string ApiUrl { get; set; }
    public string Description { get; set; }
    public int Order { get; set; }
    public string ButtonShow { get; set; }
    public bool IsDeleted { get; set; }
}