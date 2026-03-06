using Contracts;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Role.Queries;

public sealed class GetRoleLookupQueryHandler(IRoleService roleService)
    : IQueryHandler<GetRoleLookupQuery, ErrorOr<List<LookupVm>>>
{
    public async Task<ErrorOr<List<LookupVm>>> Handle(GetRoleLookupQuery request, CancellationToken cancellationToken)
    {
        return await roleService.GetAll();
    }
}


