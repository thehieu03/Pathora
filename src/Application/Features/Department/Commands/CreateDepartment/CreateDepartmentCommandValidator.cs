using FluentValidation;

namespace Application.Features.Department.Commands.CreateDepartment;

public sealed class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    public CreateDepartmentCommandValidator()
    {
        RuleFor(x => x.DepartmentName)
            .NotEmpty().WithMessage("Tên phòng ban không được để trống")
            .MaximumLength(100).WithMessage("Tên phòng ban không được quá 100 ký tự");
    }
}
