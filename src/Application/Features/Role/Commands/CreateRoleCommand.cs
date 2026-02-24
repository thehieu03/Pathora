using Application.Contracts.Role;
using Application.Services;
using Domain.CORS;
using ErrorOr;
using FluentValidation;

namespace Application.Features.Role.Commands;

public sealed record CreateRoleCommand(string Name, string Description, int Type, IEnumerable<int>? FunctionIds = null) : ICommand<ErrorOr<Guid>>;

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

public sealed class CreateRoleCommandHandler(IRoleService roleService)
    : ICommandHandler<CreateRoleCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        return await roleService.Create(new CreateRoleRequest(request.Name, request.Description, request.Type, request.FunctionIds ?? []));
    }
}

