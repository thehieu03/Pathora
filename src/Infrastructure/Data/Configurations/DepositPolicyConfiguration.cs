using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class DepositPolicyConfiguration : IEntityTypeConfiguration<DepositPolicyEntity>
{
    public void Configure(EntityTypeBuilder<DepositPolicyEntity> builder)
    {
        builder.ToTable("DepositPolicies");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.TourScope)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.DepositType)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.DepositValue)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(x => x.MinDaysBeforeDeparture)
            .IsRequired();

        builder.Property(x => x.IsActive)
            .IsRequired();

        builder.Property(x => x.IsDeleted)
            .IsRequired();

        // Translations as JSONB
        builder.Property(x => x.Translations)
            .HasColumnType("jsonb");

        builder.HasIndex(x => x.TourScope);
        builder.HasIndex(x => x.IsActive);
        builder.HasIndex(x => x.IsDeleted);
    }
}
