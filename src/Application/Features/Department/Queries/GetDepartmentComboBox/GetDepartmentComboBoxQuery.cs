using Application.Contracts.Department;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Queries.GetDepartmentComboBox;

public sealed record GetDepartmentComboBoxQuery() : IQuery<ErrorOr<List<DepartmentComboBoxVm>>>;
