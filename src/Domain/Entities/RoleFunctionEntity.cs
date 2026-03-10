using Domain.Constant;

namespace Domain.Entities;

public class RoleFunctionEntity
{
    public int RoleId { get; set; }
    public int FunctionId { get; set; }
    public virtual Function Function { get; set; } = null!;
}
