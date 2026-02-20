namespace Domain.Entities;

public sealed class Otp
{
    public required string Email { get; set; }
    public required string Code { get; set; }
    public required DateTime ExpiryDate { get; set; }
    public bool IsDeleted { get; set; } = false;
}