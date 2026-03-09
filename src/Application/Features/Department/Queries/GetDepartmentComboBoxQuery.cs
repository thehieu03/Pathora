using Application.Contracts.Department;
using BuildingBlocks.CORS;
using ErrorOr;
using Application.Services;

namespace Application.Features.Department.Queries;

public sealed record GetDepartmentComboBoxQuery() : IQuery<ErrorOr<List<DepartmentComboBoxVm>>>;

public sealed class GetDepartmentComboBoxQueryHandler(IDepartmentService departmentService)
    : IQueryHandler<GetDepartmentComboBoxQuery, ErrorOr<List<DepartmentComboBoxVm>>>
{
    public async Task<ErrorOr<List<DepartmentComboBoxVm>>> Handle(GetDepartmentComboBoxQuery request, CancellationToken cancellationToken)
    {
        return await departmentService.GetAllForComboBox();
    }
}

