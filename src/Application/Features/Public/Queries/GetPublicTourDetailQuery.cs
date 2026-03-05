using Application.Dtos;
using AutoMapper;
using Domain.Common.Repositories;
using Domain.CORS;
using Domain.Enums;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetPublicTourDetailQuery(Guid Id) : IQuery<ErrorOr<TourDto>>;

public sealed class GetPublicTourDetailQueryHandler(ITourRepository tourRepository, IMapper mapper)
    : IQueryHandler<GetPublicTourDetailQuery, ErrorOr<TourDto>>
{
    public async Task<ErrorOr<TourDto>> Handle(GetPublicTourDetailQuery request, CancellationToken cancellationToken)
    {
        var tour = await tourRepository.FindById(request.Id);

        if (tour is null || tour.IsDeleted || tour.Status != TourStatus.Active)
            return Error.NotFound("Tour.NotFound", "Tour không tìm thấy");

        return mapper.Map<TourDto>(tour);
    }
}
