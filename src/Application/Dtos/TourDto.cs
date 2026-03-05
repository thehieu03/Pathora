using Domain.Enums;

namespace Application.Dtos;

public sealed record TourDto(
    Guid Id,
    string TourCode,
    string TourName,
    string ShortDescription,
    string LongDescription,
    TourStatus Status,
    string? SEOTitle,
    string? SEODescription,
    bool IsDeleted,
    ImageDto Thumbnail,
    List<ImageDto> Images,
    List<TourClassificationDto> Classifications,
    string? CreatedBy,
    DateTimeOffset CreatedOnUtc,
    string? LastModifiedBy,
    DateTimeOffset? LastModifiedOnUtc
);
