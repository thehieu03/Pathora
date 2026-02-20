namespace Domain.Exceptionsl;

public sealed class DomainException : Exception
{
    public DomainException(string message) : base(message)
    {
    }
}
