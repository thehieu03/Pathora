using Api.Exceptions.Handler;
using Common.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;

namespace Domain.Specs.Api;

public sealed class CustomExceptionHandlerTests
{
    [Fact]
    public async Task TryHandleAsync_WhenArgumentOutOfRangeException_ShouldReturnBadRequest()
    {
        var handler = BuildHandler(includeInnerException: true, includeStackTrace: false);
        var httpContext = CreateHttpContext();

        var handled = await handler.TryHandleAsync(
            httpContext,
            new ArgumentOutOfRangeException("price", "Invalid price."),
            CancellationToken.None);

        Assert.True(handled);
        Assert.Equal(StatusCodes.Status400BadRequest, httpContext.Response.StatusCode);

        httpContext.Response.Body.Position = 0;
        using var reader = new StreamReader(httpContext.Response.Body);
        var responseBody = await reader.ReadToEndAsync();
        Assert.Contains(MessageCode.BadRequest, responseBody, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task TryHandleAsync_WhenArgumentException_ShouldReturnBadRequest()
    {
        var handler = BuildHandler(includeInnerException: true, includeStackTrace: false);
        var httpContext = CreateHttpContext();

        var handled = await handler.TryHandleAsync(
            httpContext,
            new ArgumentException("Invalid time range.", "endTime"),
            CancellationToken.None);

        Assert.True(handled);
        Assert.Equal(StatusCodes.Status400BadRequest, httpContext.Response.StatusCode);
    }

    private static CustomExceptionHandler BuildHandler(bool includeInnerException, bool includeStackTrace)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["AppConfig:IncludeInnerException"] = includeInnerException.ToString(),
                ["AppConfig:IncludeExceptionStackTrace"] = includeStackTrace.ToString()
            })
            .Build();

        var logger = Substitute.For<ILogger<CustomExceptionHandler>>();
        //return new CustomExceptionHandler(logger, configuration);
        throw new NotImplementedException("CustomExceptionHandler constructor is not implemented in this snippet.");
    }

    private static HttpContext CreateHttpContext()
    {
        var context = new DefaultHttpContext();
        context.Request.Path = "/api/test";
        context.Response.Body = new MemoryStream();
        return context;
    }
}
