using FluentValidation;

namespace Application.Features.Role.Commands.CreateRole;

public sealed class CreateRoleCommandValidator : AbstractValidator<CreateRoleCommand>
{
    public CreateRoleCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên role không được để trống")
            .MaximumLength(100).WithMessage("Tên role không được quá 100 ký tự");

        RuleFor(x => x.Description)
            .MaximumLength(250).WithMessage("Mô tả không được quá 250 ký tự");
    }
}
