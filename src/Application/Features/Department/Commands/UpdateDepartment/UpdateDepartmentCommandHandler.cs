using Application.Contracts.Department;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Commands.UpdateDepartment;

public sealed class UpdateDepartmentCommandHandler(IDepartmentService departmentService)
    : ICommandHandler<UpdateDepartmentCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateDepartmentCommand request, CancellationToken cancellationToken)
    {
        return await departmentService.Update(new UpdateDepartmentRequest(request.DepartmentId, request.DepartmentParentId, request.DepartmentName));
    }
}
