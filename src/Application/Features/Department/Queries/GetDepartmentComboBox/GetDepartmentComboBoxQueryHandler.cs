using Application.Contracts.Department;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Queries.GetDepartmentComboBox;

public sealed class GetDepartmentComboBoxQueryHandler(IDepartmentService departmentService)
    : IQueryHandler<GetDepartmentComboBoxQuery, ErrorOr<List<DepartmentComboBoxVm>>>
{
    public async Task<ErrorOr<List<DepartmentComboBoxVm>>> Handle(GetDepartmentComboBoxQuery request, CancellationToken cancellationToken)
    {
        return await departmentService.GetAllForComboBox();
    }
}
