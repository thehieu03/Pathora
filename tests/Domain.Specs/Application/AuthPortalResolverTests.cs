using Application.Common.Auth;

namespace Domain.Specs.Application;

public sealed class AuthPortalResolverTests
{
    [Fact]
    public void Resolve_WhenCustomerOnlyRole_ShouldReturnUserPortal()
    {
        // Customer role has Type=2 in the database
        var result = AuthPortalResolver.Resolve([2]);

        Assert.Equal("user", result.Portal);
        Assert.Equal("/home", result.DefaultPath);
    }

    [Theory]
    [InlineData(0)]  // Admin
    [InlineData(1)]  // Administrator
    [InlineData(9)]  // Other admin role
    public void Resolve_WhenInternalRole_ShouldReturnAdminPortal(int roleType)
    {
        var result = AuthPortalResolver.Resolve([roleType]);

        Assert.Equal("admin", result.Portal);
        Assert.Equal("/dashboard", result.DefaultPath);
    }

    [Fact]
    public void Resolve_WhenMixedRoles_ShouldPrioritizeAdminPortal()
    {
        // Customer (Type=2) + Administrator (Type=1) should route to admin
        var result = AuthPortalResolver.Resolve([2, 1]);

        Assert.Equal("admin", result.Portal);
        Assert.Equal("/dashboard", result.DefaultPath);
    }

    [Fact]
    public void Resolve_WhenNoRoles_ShouldReturnUserPortal()
    {
        var result = AuthPortalResolver.Resolve([]);

        Assert.Equal("user", result.Portal);
        Assert.Equal("/home", result.DefaultPath);
    }
}
