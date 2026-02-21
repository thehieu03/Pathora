namespace Domain.Entities;

public sealed class TourDayActivityEntity : Aggregate<Guid>
{
    public Guid TourDayId { get; set; }
    public TourDayEntity TourDay { get; set; } = null!;
    public int Order { get; set; }
    public string Destination { get; set; } = null!;
    public string? DestinationNote { get; set; }
    public TransportationType TransportationType { get; set; }
    public string? TransportationNote { get; set; }
    public string? Description { get; set; }
}
