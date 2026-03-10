namespace Domain.Entities;

public class OtpEntity
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public required string Email { get; set; }
    public required string Code { get; set; }
    public required DateTimeOffset ExpiryDate { get; set; }
    public bool IsDeleted { get; set; } = false;

    public static OtpEntity Create(string email, string code, DateTimeOffset expiryDate)
    {
        return new OtpEntity { Email = email, Code = code, ExpiryDate = expiryDate };
    }
}
