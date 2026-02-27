using Api.Exceptions;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;

namespace Api.Infrastructure;

public class CustomAuthorizationResultHandler : IAuthorizationMiddlewareResultHandler
{
    private readonly AuthorizationMiddlewareResultHandler _defaultHandler = new();

    public async Task HandleAsync(
        RequestDelegate next,
        HttpContext context,
        AuthorizationPolicy policy,
        PolicyAuthorizationResult authorizeResult)
    {
        if (authorizeResult.Forbidden)
        {
            //sử lý không có quyền truy cập chức năng này

            throw new NoPermissionException("Người dùng không có quyền truy cập chức năng này");
           
        }
        else if (authorizeResult.Challenged)
        {
            //sử lý Người dùng chưa được xác thực

            throw new UnauthorizedException("Người dùng chưa được xác thực");
        }
        else
        {
            await _defaultHandler.HandleAsync(next, context, policy, authorizeResult);
        }
    }
}
