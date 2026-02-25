using Domain.Constant;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class RoleFunctionConfiguration : IEntityTypeConfiguration<RoleFunctionEntity>
{
    public void Configure(EntityTypeBuilder<RoleFunctionEntity> builder)
    {
        // 1. Tên bảng
        builder.ToTable("RoleFunctions");

        // 2. Khóa chính phức hợp (Composite Key)
        builder.HasKey(rf => new { rf.RoleId, rf.FunctionId });

        // 3. Cấu hình quan hệ với RoleEntity
        builder.HasOne<RoleEntity>()
            .WithMany() // Nếu trong RoleEntity không có List<RoleFunctionEntity>
            .HasForeignKey(rf => rf.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        // 4. Cấu hình quan hệ với FunctionEntity
        builder.HasOne(rf => rf.Function) // Thay đổi ở đây
            .WithMany()
            .HasForeignKey(rf => rf.FunctionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}