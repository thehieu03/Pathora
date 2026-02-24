using Application.Contracts.Department;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Commands.CreateDepartment;

public sealed class CreateDepartmentCommandHandler(IDepartmentService departmentService)
    : ICommandHandler<CreateDepartmentCommand, ErrorOr<Guid>>
{
    public async Task<ErrorOr<Guid>> Handle(CreateDepartmentCommand request, CancellationToken cancellationToken)
    {
        return await departmentService.Create(new CreateDepartmentRequest(request.DepartmentParentId, request.DepartmentName));
    }
}
