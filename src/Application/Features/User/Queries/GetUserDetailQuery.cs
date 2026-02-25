using Application.Contracts.User;
using Domain.CORS;
using ErrorOr;

namespace Application.Features.User.Queries;

public sealed record GetUserDetailQuery(Guid Id) : IQuery<ErrorOr<UserDetailVm>>;

