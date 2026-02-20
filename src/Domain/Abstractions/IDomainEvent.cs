using MediatR;

namespace Domain.Abstractions;

public interface IDomainEvent : INotification
{
    #region Fields, Properties and Indexers

    Guid EventId => Guid.NewGuid();

    public DateTimeOffset OccurredOn => DateTimeOffset.UtcNow;

    public string EventType => GetType()?.AssemblyQualifiedName ?? string.Empty;

    #endregion

}
