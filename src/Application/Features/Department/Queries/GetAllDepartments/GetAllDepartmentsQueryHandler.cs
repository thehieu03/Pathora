using Application.Common.Contracts;
using Application.Contracts.Department;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Queries.GetAllDepartments;

public sealed class GetAllDepartmentsQueryHandler(IDepartmentService departmentService)
    : IQueryHandler<GetAllDepartmentsQuery, ErrorOr<PaginatedListWithPermissions<DepartmentVm>>>
{
    public async Task<ErrorOr<PaginatedListWithPermissions<DepartmentVm>>> Handle(GetAllDepartmentsQuery request, CancellationToken cancellationToken)
    {
        return await departmentService.GetAll();
    }
}
