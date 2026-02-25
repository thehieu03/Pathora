namespace Domain.Entities;

public sealed class OtpEntity
{
    public required string Email { get; set; }
    public required string Code { get; set; }
    public required DateTimeOffset ExpiryDate { get; set; }
    public bool IsDeleted { get; set; } = false;

    public static OtpEntity Create(string email, string code, DateTimeOffset expiryDate)
    {
        return new OtpEntity { Email = email, Code = code, ExpiryDate = expiryDate };
    }
}

