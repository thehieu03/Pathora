namespace Domain.Mails;

[AttributeUsage(AttributeTargets.Class)]
public class MailAttribute : Attribute
{
    public string Subject { get; set; }

    public MailAttribute(string subject)
    {
        Subject = subject;
    }
}