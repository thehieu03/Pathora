using Domain.Abstractions;

namespace Domain.Mails;

public class MailEntity : Aggregate<Guid>
{
    public string To { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public string Body { get; set; } = null!;
    public string Template { get; set; } = null!;
    public MailStatus Status { get; set; } = MailStatus.Pending;
    public DateTime? SentAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

