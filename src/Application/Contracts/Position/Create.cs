using FluentValidation;

namespace Application.Contracts.Position;

public sealed record CreatePositionRequest(
    string Name,
    int Level,
    string? Note,
    int? Type
);

public sealed class CreatePositionRequestValidator : AbstractValidator<CreatePositionRequest>
{
    public CreatePositionRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên chức vụ không được để trống")
            .MaximumLength(255).WithMessage("Tên chức vụ không được quá 255 ký tự");
        RuleFor(x => x.Note)
            .MaximumLength(255).WithMessage("Ghi chú không được quá 255 ký tự");
    }
}

