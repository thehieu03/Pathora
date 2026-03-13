using Api.Exceptions;
using Application.Common.Constant;
using Contracts.Interfaces;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;

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
        var lang = context.RequestServices.GetService<ILanguageContext>()?.CurrentLanguage
            ?? ILanguageContext.DefaultLanguage;

        if (authorizeResult.Forbidden)
        {
            throw new NoPermissionException(ErrorConstants.Authorization.ForbiddenDescription.Resolve(lang));
        }
        else if (authorizeResult.Challenged)
        {
            throw new UnauthorizedException(ErrorConstants.Authorization.UnauthorizedDescription.Resolve(lang));
        }
        else
        {
            await _defaultHandler.HandleAsync(next, context, policy, authorizeResult);
        }
    }
}
