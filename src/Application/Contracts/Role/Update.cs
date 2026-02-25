using Domain.Enums;
using FluentValidation;

namespace Application.Contracts.Role;

public sealed record UpdateRoleRequest(
    string RoleId,
    string Name,
    string Description,
    RoleStatus Status,
    int Type,
    IEnumerable<int> FunctionIds);

public sealed class UpdateRoleRequestValidator : AbstractValidator<UpdateRoleRequest>
{
    public UpdateRoleRequestValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Trạng thái role không hợp lệ");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên role không được để trống")
            .MaximumLength(100).WithMessage("Tên role không được quá 100 ký tự");

        RuleFor(x => x.Description)
            .MaximumLength(250).WithMessage("Mô tả không được quá 250 ký tự");
    }
}
