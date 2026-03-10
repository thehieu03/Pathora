using Contracts;
using BuildingBlocks.CORS;
using ErrorOr;
using Application.Services;

namespace Application.Features.Role.Queries;

public sealed record GetRoleLookupQuery() : IQuery<ErrorOr<List<LookupVm>>>;

public sealed class GetRoleLookupQueryHandler(IRoleService roleService)
    : IQueryHandler<GetRoleLookupQuery, ErrorOr<List<LookupVm>>>
{
    public async Task<ErrorOr<List<LookupVm>>> Handle(GetRoleLookupQuery request, CancellationToken cancellationToken)
    {
        return await roleService.GetAll();
    }
}

