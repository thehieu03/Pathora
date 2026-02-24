using FluentValidation;

namespace Application.Features.Position.Commands.CreatePosition;

public sealed class CreatePositionCommandValidator : AbstractValidator<CreatePositionCommand>
{
    public CreatePositionCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên chức vụ không được để trống")
            .MaximumLength(255).WithMessage("Tên chức vụ không được quá 255 ký tự");
    }
}
