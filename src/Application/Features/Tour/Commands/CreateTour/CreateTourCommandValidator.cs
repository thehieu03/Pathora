using FluentValidation;

namespace Application.Features.Tour.Commands.CreateTour;

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
