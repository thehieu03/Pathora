using Api.Infrastructure;
using Application.Contracts.Identity;
using Microsoft.AspNetCore.Http;

namespace Domain.Specs.Api;

public sealed class AuthCookieWriterTests
{
    [Fact]
    public void WriteAuthCookies_ShouldAppendHttpOnlyCookies()
    {
        var httpContext = new DefaultHttpContext();
        var tokens = new ExternalLoginResponse("access-token", "refresh-token");

        AuthCookieWriter.WriteAuthCookies(httpContext.Response, tokens, secure: false);

        var setCookie = httpContext.Response.Headers.SetCookie.ToString();
        Assert.Contains("access_token=access-token", setCookie);
        Assert.Contains("refresh_token=refresh-token", setCookie);
        Assert.Contains("auth_status=1", setCookie);
        Assert.Contains("httponly", setCookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("samesite=lax", setCookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("path=/", setCookie, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void ClearAuthCookies_ShouldExpireBothCookies()
    {
        var httpContext = new DefaultHttpContext();

        AuthCookieWriter.ClearAuthCookies(httpContext.Response, secure: false);

        var setCookie = httpContext.Response.Headers.SetCookie.ToString();
        Assert.Contains("access_token=", setCookie);
        Assert.Contains("refresh_token=", setCookie);
        Assert.Contains("auth_status=", setCookie);
        Assert.Contains("expires=thu, 01 jan 1970", setCookie, StringComparison.OrdinalIgnoreCase);
    }
}
