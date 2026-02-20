using Domain.Constant;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class FunctionConfiguration : IEntityTypeConfiguration<Function>
{
    public void Configure(EntityTypeBuilder<Function> builder)
    {
        builder.ToTable("Functions");

        builder.HasKey(f => f.Id);

        builder.Property(f => f.CategoryId)
            .IsRequired();

        builder.Property(f => f.ApiUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(f => f.Description)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(f => f.Order)
            .HasDefaultValue(0);

        builder.Property(f => f.ButtonShow)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(f => f.IsDeleted)
            .HasDefaultValue(false);
    }
}
