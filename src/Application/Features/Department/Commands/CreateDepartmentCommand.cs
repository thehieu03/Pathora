using Domain.CORS;
using ErrorOr;
using FluentValidation;
using Application.Contracts.Department;
using Application.Services;

namespace Application.Features.Department.Commands;

public sealed record CreateDepartmentCommand(Guid? DepartmentParentId, string DepartmentName) : ICommand<ErrorOr<Guid>>;

public sealed class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    public CreateDepartmentCommandValidator()
    {
        RuleFor(x => x.DepartmentName)
            .NotEmpty().WithMessage("Tên phòng ban không được để trống")
            .MaximumLength(100).WithMessage("Tên phòng ban không được quá 100 ký tự");
    }
}

public sealed class CreateDepartmentCommandHandler(IDepartmentService departmentService)
    : ICommandHandler<CreateDepartmentCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateDepartmentCommand request, CancellationToken cancellationToken)
    {
        return await departmentService.Create(new CreateDepartmentRequest(request.DepartmentParentId, request.DepartmentName));
    }
}


