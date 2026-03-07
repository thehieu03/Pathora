namespace Domain.Entities;

public class UserRoleEntity
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }

    public static UserRoleEntity Create(Guid userId, Guid roleId)
    {
        return new UserRoleEntity { UserId = userId, RoleId = roleId };
    }
}
