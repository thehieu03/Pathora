using Domain.Constant;

namespace Domain.Entities;

public class RoleFunctionEntity
{
    public Guid RoleId { get; set; }
    public int FunctionId { get; set; }
    public virtual Function Function { get; set; } = null!;
}
