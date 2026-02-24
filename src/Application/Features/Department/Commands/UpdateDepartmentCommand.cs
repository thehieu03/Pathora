using Domain.CORS;
using ErrorOr;
using Application.Contracts.Department;
using Application.Services;

namespace Application.Features.Department.Commands;

public sealed record UpdateDepartmentCommand(Guid DepartmentId, Guid? DepartmentParentId, string DepartmentName) : ICommand<ErrorOr<Success>>;

public sealed class UpdateDepartmentCommandHandler(IDepartmentService departmentService)
    : ICommandHandler<UpdateDepartmentCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(UpdateDepartmentCommand request, CancellationToken cancellationToken)
    {
        return await departmentService.Update(new UpdateDepartmentRequest(request.DepartmentId, request.DepartmentParentId, request.DepartmentName));
    }
}


