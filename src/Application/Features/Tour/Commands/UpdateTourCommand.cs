using Application.Dtos;
using Domain.CORS;
using Domain.Entities.Translations;
using Domain.Enums;
using ErrorOr;
using Application.Services;

namespace Application.Features.Tour.Commands;

public sealed record UpdateTourCommand(
    Guid Id,
    string TourName,
    string ShortDescription,
    string LongDescription,
    string? SEOTitle,
    string? SEODescription,
    TourStatus Status,
    ImageInputDto? Thumbnail = null,
    List<ImageInputDto>? Images = null,
    Dictionary<string, TourTranslationData>? Translations = null) : ICommand<ErrorOr<Success>>;

public sealed class UpdateTourCommandHandler(ITourService tourService)
    : ICommandHandler<UpdateTourCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateTourCommand request, CancellationToken cancellationToken)
    {
        return await tourService.Update(request);
    }
}


