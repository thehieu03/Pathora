using System.Security.Claims;
using Application.Common.Repositories;
using Domain.Constant;
using Microsoft.AspNetCore.Authorization;

namespace Api.Infrastructure;

public class EndpointAccessRequirement : IAuthorizationRequirement;

public class EndpointAccessHandler : AuthorizationHandler<EndpointAccessRequirement>
{
    private readonly IFunctionRepository _functionRepository;

    public EndpointAccessHandler(IServiceScopeFactory factory)
    {
        using var scope = factory.CreateScope();
        _functionRepository = scope.ServiceProvider.GetRequiredService<IFunctionRepository>();
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        EndpointAccessRequirement requirement)
    {
        var httpContext = context.Resource as HttpContext ?? throw new InvalidOperationException();

        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
        {
            context.Fail();
        }

        var functionsResult = await _functionRepository.FindAll();
        if (functionsResult.IsError) context.Fail();
        var allowedEndpoints = functionsResult.Value;

        var userAllowedEndpointsResult = await _functionRepository.FindUserFunctions(userId!);
        if (userAllowedEndpointsResult.IsError) context.Fail();
        var userAllowedEndpoints = userAllowedEndpointsResult.Value;

        var path = httpContext.Request.Path.Value;
        if (path is null) context.Fail();

        if (IsUserAuthorized(path, allowedEndpoints, userAllowedEndpoints))
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
        }
    }

    private static bool IsUserAuthorized(
        string? path,
        List<Function> allowedEndpoints,
        List<Function> userAllowedEndpoints)
    {
        return path != null
               && allowedEndpoints.Any(x => path.StartsWith(x.ApiUrl, StringComparison.OrdinalIgnoreCase))
               && userAllowedEndpoints.Any(x => path.StartsWith(x.ApiUrl, StringComparison.OrdinalIgnoreCase));
    }
}