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
}
