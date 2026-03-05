using Application.Common.Constant;
using Application.Dtos;
using Domain.CORS;
using Domain.Enums;
using ErrorOr;
using FluentValidation;
using Application.Services;

namespace Application.Features.Tour.Commands;

public sealed record CreateTourCommand(
    string TourName,
    string ShortDescription,
    string LongDescription,
    string? SEOTitle,
    string? SEODescription,
    TourStatus Status,
    ImageInputDto? Thumbnail = null,
    List<ImageInputDto>? Images = null) : ICommand<ErrorOr<Guid>>;

public sealed class CreateTourCommandValidator : AbstractValidator<CreateTourCommand>
{
    public CreateTourCommandValidator()
    {
        RuleFor(x => x.TourName)
            .NotEmpty().WithMessage(ValidationMessages.TourNameRequired)
            .MaximumLength(500).WithMessage(ValidationMessages.TourNameMaxLength500);
    }
}

public sealed class CreateTourCommandHandler(ITourService tourService)
    : ICommandHandler<CreateTourCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateTourCommand request, CancellationToken cancellationToken)
    {
        return await tourService.Create(request);
    }
}


