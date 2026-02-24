using Application.Common.Contracts;
using Application.Contracts.Department;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Queries;

public sealed record GetAllDepartmentsQuery() : IQuery<ErrorOr<PaginatedListWithPermissions<DepartmentVm>>>;

