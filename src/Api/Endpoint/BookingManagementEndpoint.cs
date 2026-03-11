namespace Api.Endpoint;

public static class BookingManagementEndpoint
{
    public const string Base = "api/bookings";
    public const string BookingId = "{id:guid}";
    public const string ActivityId = "{activityId:guid}";

    public const string Activities = "{id:guid}/activities";
    public const string ActivityDetail = "{id:guid}/activities/{activityId:guid}";
    public const string TransportDetails = "{id:guid}/transport-details";
    public const string AccommodationDetails = "{id:guid}/accommodation-details";
    public const string Participants = "{id:guid}/participants";
    public const string Payables = "{id:guid}/payables";
}
