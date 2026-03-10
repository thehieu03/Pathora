using Application.Contracts.Identity;
using Microsoft.AspNetCore.Http;

namespace Api.Infrastructure;

public static class AuthCookieWriter
{
    private const string AccessTokenCookieName = "access_token";
    private const string RefreshTokenCookieName = "refresh_token";
    private static readonly TimeSpan AccessTokenLifetime = TimeSpan.FromDays(1);
    private static readonly TimeSpan RefreshTokenLifetime = TimeSpan.FromDays(7);

    public static void WriteAuthCookies(HttpResponse response, ExternalLoginResponse tokens, bool secure)
    {
        response.Cookies.Append(AccessTokenCookieName, tokens.AccessToken, BuildOptions(AccessTokenLifetime, secure));
        response.Cookies.Append(RefreshTokenCookieName, tokens.RefreshToken, BuildOptions(RefreshTokenLifetime, secure));
    }

    public static void ClearAuthCookies(HttpResponse response, bool secure)
    {
        response.Cookies.Delete(AccessTokenCookieName, BuildOptions(TimeSpan.Zero, secure));
        response.Cookies.Delete(RefreshTokenCookieName, BuildOptions(TimeSpan.Zero, secure));
    }

    private static CookieOptions BuildOptions(TimeSpan maxAge, bool secure)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            MaxAge = maxAge,
            Path = "/",
            SameSite = SameSiteMode.Lax,
            Secure = secure
        };
    }
}
