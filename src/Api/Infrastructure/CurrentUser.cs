using System.Security.Claims;
using Application.Common.Interfaces;

namespace Api.Infrastructure;

public class CurrentUser(IHttpContextAccessor httpContextAccessor) : IUser
{
    public string? Id => httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
}