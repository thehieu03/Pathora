using Application.Contracts.Identity;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.Identity.Queries.GetUserInfo;

public sealed record GetUserInfoQuery() : IQuery<ErrorOr<UserInfoVm>>;
