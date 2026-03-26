using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Api.Middleware;

public sealed class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("StatusCode cannot be set because the response has already started"))
        {
            // Suppress: this exception is thrown by JwtBearerHandler.HandleChallengeAsync when it
            // tries to set StatusCode after our OnChallenge callback already started the response.
            // Since the response is already in flight with a correct status code, we just log and
            // suppress the exception to prevent it from bubbling up as an unhandled error.
            logger.LogDebug(
                "Suppressed 'response already started' exception during auth challenge. " +
                "Response status: {StatusCode}",
                context.Response.StatusCode);
        }
    }
}
