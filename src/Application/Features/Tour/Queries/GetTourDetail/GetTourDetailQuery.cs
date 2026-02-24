using Domain.CORS;
using Domain.Entities;
using ErrorOr;

namespace Application.Features.Tour.Queries.GetTourDetail;

public sealed record GetTourDetailQuery(Guid Id) : IQuery<ErrorOr<TourEntity>>;
