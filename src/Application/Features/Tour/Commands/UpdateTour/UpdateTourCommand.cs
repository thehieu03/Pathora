using Domain.CORS;
using Domain.Enums;
using ErrorOr;

namespace Application.Features.Tour.Commands.UpdateTour;

public sealed record UpdateTourCommand(
    Guid Id,
    string TourCode,
    string TourName,
    string ShortDescription,
    string LongDescription,
    string? SEOTitle,
    string? SEODescription,
    TourStatus Status) : ICommand<ErrorOr<Success>>;
