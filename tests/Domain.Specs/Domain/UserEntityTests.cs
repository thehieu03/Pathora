using Domain.Entities;

namespace Domain.Specs.Domain;

public sealed class UserEntityTests
{
    [Fact]
    public void Status_PropertyType_ShouldBeNonNullableEnum()
    {
        var statusProperty = typeof(UserEntity).GetProperty(nameof(UserEntity.Status));

        Assert.NotNull(statusProperty);
        Assert.Equal(typeof(global::Domain.Enums.UserStatus), statusProperty!.PropertyType);
    }

    [Fact]
    public void Create_WhenInvoked_ShouldInitializeBalanceToZero()
    {
        var user = UserEntity.Create(
            "username",
            "Full Name",
            "user@example.com",
            "hashed-password",
            "system");

        Assert.Equal(0m, user.Balance);
    }

    [Fact]
    public void CreateFromGoogle_WhenInvoked_ShouldInitializeBalanceToZero()
    {
        var user = UserEntity.CreateFromGoogle(
            "google-id",
            "user@example.com",
            "Google User",
            null);

        Assert.Equal(0m, user.Balance);
    }
}
