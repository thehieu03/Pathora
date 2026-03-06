using Application.Common;
using Application.Common.Contracts;
using Application.Common.Interfaces;
using Application.Contracts.Department;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Department.Queries;

public sealed record GetAllDepartmentsQuery() : IQuery<ErrorOr<PaginatedListWithPermissions<DepartmentVm>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Department}:all";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(30);
}

