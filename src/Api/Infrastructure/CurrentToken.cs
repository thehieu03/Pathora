using System.Security.Claims;
using Application.Common.Interfaces;

namespace Api.Infrastructure;

public class CurrentToken(IHttpContextAccessor httpContextAccessor) : IToken
{
    public string? Id => httpContextAccessor.HttpContext?.User.FindFirstValue("jti");
    public string? Token => httpContextAccessor.HttpContext?.Request.Headers["Authorization"];
    public string? Expire => httpContextAccessor.HttpContext?.User.FindFirstValue("exp");
}

