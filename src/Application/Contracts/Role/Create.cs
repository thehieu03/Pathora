using Application.Common.Repositories;
using FluentValidation;

namespace Application.Contracts.Role;

public sealed record CreateRoleRequest(string Name, string Description, int Type, IEnumerable<int> FunctionIds);

public sealed class CreateRoleRequestValidator : AbstractValidator<CreateRoleRequest>
{
    public CreateRoleRequestValidator(IRoleRepository roleRepository, IFunctionRepository functionRepository)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên role không được để trống")
            .MaximumLength(100).WithMessage("Tên role không được quá 100 ký tự");

        RuleFor(x => x.Description)
            .MaximumLength(250).WithMessage("Mô tả không được quá 250 ký tự");
    }
}

public sealed record CreateRoleResponse(Guid Id);