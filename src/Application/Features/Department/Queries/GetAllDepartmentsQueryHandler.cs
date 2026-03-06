using Contracts;
using Application.Contracts.Department;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Department.Queries;

public sealed class GetAllDepartmentsQueryHandler(IDepartmentService departmentService)
    : IQueryHandler<GetAllDepartmentsQuery, ErrorOr<PaginatedListWithPermissions<DepartmentVm>>>
{
    public async Task<ErrorOr<PaginatedListWithPermissions<DepartmentVm>>> Handle(GetAllDepartmentsQuery request, CancellationToken cancellationToken)
    {
        return await departmentService.GetAll();
    }
}


