namespace Application.Dtos;

public sealed record TransportationDto(
    string FromLocation,
    string ToLocation,
    string? FromCity,
    string? ToCity,
    string? FromCountry,
    string? ToCountry,
    string TransportationType,
    string? TransportationName,
    int? DurationMinutes,
    decimal? Price,
    string? Note);
