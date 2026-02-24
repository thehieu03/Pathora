using Application.Contracts.Role;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Role.Queries.GetRoleDetail;

public sealed record GetRoleDetailQuery(string RoleId) : IQuery<ErrorOr<RoleDetailVm>>;
