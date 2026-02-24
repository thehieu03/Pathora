using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Commands.DeleteDepartment;

public sealed class DeleteDepartmentCommandHandler(IDepartmentService departmentService)
    : ICommandHandler<DeleteDepartmentCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(DeleteDepartmentCommand request, CancellationToken cancellationToken)
    {
        return await departmentService.Delete(request.Id);
    }
}
