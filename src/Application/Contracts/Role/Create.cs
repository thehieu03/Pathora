using Application.Common.Constant;
using Domain.Common.Repositories;
using FluentValidation;

namespace Application.Contracts.Role;

public sealed record CreateRoleRequest(string Name, string Description, int Type, IEnumerable<int>? FunctionIds = null);

public sealed class CreateRoleRequestValidator : AbstractValidator<CreateRoleRequest>
{
    public CreateRoleRequestValidator(IRoleRepository roleRepository, IFunctionRepository functionRepository)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(ValidationMessages.RoleNameRequired)
            .MaximumLength(100).WithMessage(ValidationMessages.RoleNameMaxLength100);

        RuleFor(x => x.Description)
            .MaximumLength(250).WithMessage(ValidationMessages.DescriptionMaxLength250);
    }
}

public sealed record CreateRoleResponse(Guid Id);
