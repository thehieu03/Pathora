using Application.Common.Auth;

namespace Domain.Specs.Application;

public sealed class AuthPortalResolverTests
{
    [Fact]
    public void Resolve_WhenCustomerOnlyRole_ShouldReturnUserPortal()
    {
        var result = AuthPortalResolver.Resolve([3]);

        Assert.Equal("user", result.Portal);
        Assert.Equal("/home", result.DefaultPath);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(9)]
    public void Resolve_WhenInternalRole_ShouldReturnAdminPortal(int roleType)
    {
        var result = AuthPortalResolver.Resolve([roleType]);

        Assert.Equal("admin", result.Portal);
        Assert.Equal("/dashboard", result.DefaultPath);
    }

    [Fact]
    public void Resolve_WhenMixedRoles_ShouldPrioritizeAdminPortal()
    {
        var result = AuthPortalResolver.Resolve([3, 1]);

        Assert.Equal("admin", result.Portal);
        Assert.Equal("/dashboard", result.DefaultPath);
    }
}
