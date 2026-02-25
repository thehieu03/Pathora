namespace Application.Dtos;

public sealed record TourClassificationDto(
    Guid Id,
    Guid TourId,
    string Name,
    decimal Price,
    decimal SalePrice,
    string Description,
    int DurationDays,
    string? CreatedBy,
    DateTimeOffset CreatedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset? LastModifiedOnUtc
);
