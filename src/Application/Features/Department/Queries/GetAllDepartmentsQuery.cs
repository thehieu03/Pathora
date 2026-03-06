using Application.Common;
using Contracts;
using Contracts.Interfaces;
using Application.Contracts.Department;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Department.Queries;

public sealed record GetAllDepartmentsQuery() : IQuery<ErrorOr<PaginatedListWithPermissions<DepartmentVm>>>, ICacheable
{
    public string CacheKey => $"{Common.CacheKey.Department}:all";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(30);
}


