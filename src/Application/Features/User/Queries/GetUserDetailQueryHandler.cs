using Application.Contracts.User;
using Application.Services;
using BuildingBlocks.CORS;
using ErrorOr;

namespace Application.Features.User.Queries;

public sealed class GetUserDetailQueryHandler(IUserService userService)
    : IQueryHandler<GetUserDetailQuery, ErrorOr<UserDetailVm>>
{
    public async Task<ErrorOr<UserDetailVm>> Handle(GetUserDetailQuery request, CancellationToken cancellationToken)
    {
        return await userService.GetDetail(request.Id);
    }
}


