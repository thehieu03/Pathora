using Domain.CORS;
using Domain.Enums;
using ErrorOr;
using FluentValidation;
using Application.Services;

namespace Application.Features.Tour.Commands;

public sealed record CreateTourCommand(
    string TourCode,
    string TourName,
    string ShortDescription,
    string LongDescription,
    string? SEOTitle,
    string? SEODescription,
    TourStatus Status) : ICommand<ErrorOr<Guid>>;

public sealed class CreateTourCommandValidator : AbstractValidator<CreateTourCommand>
{
    public CreateTourCommandValidator()
    {
        RuleFor(x => x.TourCode)
            .NotEmpty().WithMessage("Mã tour không được để trống");

        RuleFor(x => x.TourName)
            .NotEmpty().WithMessage("Tên tour không được để trống")
            .MaximumLength(500).WithMessage("Tên tour không được quá 500 ký tự");
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


