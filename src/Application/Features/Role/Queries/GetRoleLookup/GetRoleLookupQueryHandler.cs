using Application.Common.Contracts;
using Application.Services;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Role.Queries.GetRoleLookup;

public sealed class GetRoleLookupQueryHandler(IRoleService roleService)
    : IQueryHandler<GetRoleLookupQuery, ErrorOr<List<LookupVm>>>
{
    public async Task<ErrorOr<List<LookupVm>>> Handle(GetRoleLookupQuery request, CancellationToken cancellationToken)
    {
        return await roleService.GetAll();
    }
}
