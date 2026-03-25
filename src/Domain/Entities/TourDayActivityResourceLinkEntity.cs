namespace Domain.Entities;

public class TourDayActivityResourceLinkEntity : Entity<Guid>
{
    public Guid TourDayActivityId { get; set; }
    public virtual TourDayActivityEntity TourDayActivity { get; set; } = null!;
    public string Url { get; set; } = null!;
    public int Order { get; set; }

    public static TourDayActivityResourceLinkEntity Create(Guid tourDayActivityId, string url, int order, string performedBy)
    {
        EnsureValidOrder(order);

        return new TourDayActivityResourceLinkEntity
        {
            Id = Guid.CreateVersion7(),
            TourDayActivityId = tourDayActivityId,
            Url = url,
            Order = order,
            CreatedBy = performedBy,
            LastModifiedBy = performedBy,
            CreatedOnUtc = DateTimeOffset.UtcNow,
            LastModifiedOnUtc = DateTimeOffset.UtcNow
        };
    }

    private static void EnsureValidOrder(int order)
    {
        if (order <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(order), "Order must be greater than zero.");
        }
    }
}
