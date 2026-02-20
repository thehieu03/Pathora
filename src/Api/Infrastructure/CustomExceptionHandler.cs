using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;

namespace Api.Infrastructure;

public class CustomExceptionHandler : IExceptionHandler
{
    private readonly Dictionary<Type, Func<HttpContext, Exception, CancellationToken, Task>> _exceptionHandlers;

    public CustomExceptionHandler()
    {
        _exceptionHandlers = new Dictionary<Type, Func<HttpContext, Exception, CancellationToken, Task>>
        {
            { typeof(ValidationException), HandleValidationException },
        };
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception,
        CancellationToken cancellationToken)
    {
        var exceptionType = exception.GetType();

        if (_exceptionHandlers.TryGetValue(exceptionType, out var handler))
        {
            await handler.Invoke(httpContext, exception, cancellationToken);
            return true;
        }

        httpContext.Response.StatusCode = StatusCodes.Status200OK;
        //await httpContext.Response.WriteAsJsonAsync(
        //    Log.ProcessError($"""
        //                      {exception.Message}
        //                      {exception.StackTrace}
        //                      """)
        //        .ToResultError(),
        //    cancellationToken);
        return true;
    }

    private async Task HandleValidationException(
        HttpContext httpContext,
        Exception ex,
        CancellationToken cancellationToken)
    {
        var exception = (ValidationException)ex;
        httpContext.Response.StatusCode = StatusCodes.Status200OK;
        //await httpContext.Response.WriteAsJsonAsync(
        //    exception.Errors.ToValidationErrorResult(),
        //    cancellationToken: cancellationToken
        //);
    }
}
