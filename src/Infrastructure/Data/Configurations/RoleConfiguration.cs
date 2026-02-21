using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<RoleEntity>
{
    public void Configure(EntityTypeBuilder<RoleEntity> builder)
    {
        builder.ToTable("Roles");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(r => r.Name)
            .IsUnique();

        builder.Property(r => r.Description)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(r => r.Type)
            .IsRequired();

        builder.Property(r => r.Status)
            .HasDefaultValue(RoleStatus.Active);

        builder.Property(r => r.IsDeleted)
            .HasDefaultValue(false);

        builder.HasMany<UserRole>()
            .WithOne()
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
