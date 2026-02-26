using Application.Dtos;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Tour.Queries;

public sealed record GetTourDetailQuery(Guid Id) : IQuery<ErrorOr<TourDto>>;

