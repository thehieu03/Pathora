namespace Application.Common.Interfaces;

public interface ICacheInvalidator
{
    IReadOnlyList<string> CacheKeysToInvalidate { get; }
}
