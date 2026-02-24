using Application.Common.Contracts;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Tour.Queries.GetAllTours;

public sealed record GetAllToursQuery(string? SearchText, int PageNumber = 1, int PageSize = 10)
    : IQuery<ErrorOr<PaginatedList<TourVm>>>;

public sealed record TourVm(
    Guid Id,
    string TourCode,
    string TourName,
    string ShortDescription,
    string Status,
    DateTimeOffset CreatedOnUtc);
