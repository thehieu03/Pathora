using Application.Contracts.Department;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Department.Queries;

public sealed class GetDepartmentComboBoxQueryHandler(IDepartmentService departmentService)
    : IQueryHandler<GetDepartmentComboBoxQuery, ErrorOr<List<DepartmentComboBoxVm>>>
{
    public async Task<ErrorOr<List<DepartmentComboBoxVm>>> Handle(GetDepartmentComboBoxQuery request, CancellationToken cancellationToken)
    {
        return await departmentService.GetAllForComboBox();
    }
}


