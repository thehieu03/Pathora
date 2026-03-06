using Application.Contracts.Identity;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.Identity.Queries;

public sealed record GetUserInfoQuery() : IQuery<ErrorOr<UserInfoVm>>;


