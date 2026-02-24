using Application.Contracts.Department;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Queries;

public sealed record GetDepartmentComboBoxQuery() : IQuery<ErrorOr<List<DepartmentComboBoxVm>>>;

