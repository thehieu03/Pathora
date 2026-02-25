using FluentValidation;

namespace Application.Contracts.Department;

public sealed record UpdateDepartmentRequest(
    Guid DepartmentId,
    Guid? DepartmentParentId,
    string DepartmentName);

public sealed class UpdateDepartmentRequestValidator : AbstractValidator<UpdateDepartmentRequest>
{
    public UpdateDepartmentRequestValidator()
    {
        RuleFor(x => x.DepartmentName)
            .NotEmpty()
            .WithMessage("Tên phòng ban không được để trống")
            .MaximumLength(100)
            .WithMessage("Tên phòng ban không được quá 100 ký tự");
    }
}

