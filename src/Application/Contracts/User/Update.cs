using FluentValidation;

namespace Application.Contracts.User;

public sealed record UpdateUserRequest(
    Guid Id,
    List<UserDepartmentInfo> Departments,
    List<Guid> RoleIds,
    string FullName,
    string Avatar
);

public sealed class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(x => x.FullName)
            .Length(1, 200).WithMessage("Họ và tên quá dài")
            .When(x => !string.IsNullOrEmpty(x.FullName));
    }
}

