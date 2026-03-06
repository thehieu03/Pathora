namespace Application.Common.Interfaces;

public interface ICacheable
{
    string CacheKey { get; }
    TimeSpan? Expiration { get; }
}
