using Application.Dtos;
using Contracts.Interfaces;
using AutoMapper;
using Domain.Common.Repositories;
using Domain.Entities.Translations;
using BuildingBlocks.CORS;
using Domain.Enums;
using ErrorOr;

namespace Application.Features.Public.Queries;

public sealed record GetPublicTourDetailQuery(Guid Id) : IQuery<ErrorOr<TourDto>>;

public sealed class GetPublicTourDetailQueryHandler(ITourRepository tourRepository, IMapper mapper, ILanguageContext? languageContext = null)
    : IQueryHandler<GetPublicTourDetailQuery, ErrorOr<TourDto>>
{
    private readonly ILanguageContext _languageContext = languageContext ?? new FallbackLanguageContext();

    public async Task<ErrorOr<TourDto>> Handle(GetPublicTourDetailQuery request, CancellationToken cancellationToken)
    {
        var tour = await tourRepository.FindByIdReadOnly(request.Id);

        if (tour is null || tour.IsDeleted || tour.Status != TourStatus.Active)
            return Error.NotFound("Tour.NotFound", "Tour không tìm thấy");

        tour.ApplyResolvedTranslations(_languageContext.CurrentLanguage);
        return mapper.Map<TourDto>(tour);
    }

    private sealed class FallbackLanguageContext : ILanguageContext
    {
        public string CurrentLanguage { get; set; } = ILanguageContext.DefaultLanguage;
    }
}

