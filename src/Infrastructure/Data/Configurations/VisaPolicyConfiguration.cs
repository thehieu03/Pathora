using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class VisaPolicyConfiguration : IEntityTypeConfiguration<VisaPolicyEntity>
{
    public void Configure(EntityTypeBuilder<VisaPolicyEntity> builder)
    {
        builder.ToTable("VisaPolicies");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Region)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.ProcessingDays)
            .IsRequired();

        builder.Property(x => x.BufferDays)
            .IsRequired();

        builder.Property(x => x.FullPaymentRequired)
            .IsRequired();

        builder.Property(x => x.IsActive)
            .IsRequired();

        builder.Property(x => x.IsDeleted)
            .IsRequired();

        builder.HasIndex(x => x.Region);
        builder.HasIndex(x => x.IsActive);
        builder.HasIndex(x => x.IsDeleted);
    }
}
