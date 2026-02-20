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


            //context.Response.StatusCode = StatusCodes.Status200OK;
            //await context.Response.WriteAsJsonAsync(new Result
            //{
            //    Status = 1,
            //    StatusCode = StatusCodes.Status403Forbidden,
            //    Object = "Người dùng không có quyền truy cập chức năng này"
            //});
        }
        else if (authorizeResult.Challenged)
        {
            //sử lý Người dùng chưa được xác thực


            //context.Response.StatusCode = StatusCodes.Status200OK;
            //await context.Response.WriteAsJsonAsync(new Result
            //{
            //    Status = 1,
            //    StatusCode = StatusCodes.Status401Unauthorized,
            //    Object = "Người dùng chưa được xác thực"
            //});
        }
        else
        {
            await _defaultHandler.HandleAsync(next, context, policy, authorizeResult);
        }
    }
}
