using Application.Contracts.Department;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Department.Queries;

public sealed record GetDepartmentComboBoxQuery() : IQuery<ErrorOr<List<DepartmentComboBoxVm>>>;


