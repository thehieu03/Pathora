using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class CancellationPolicyEntityConfiguration : IEntityTypeConfiguration<CancellationPolicyEntity>
{
    public void Configure(EntityTypeBuilder<CancellationPolicyEntity> builder)
    {
        builder.ToTable("CancellationPolicies");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.PolicyCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(p => p.PolicyCode)
            .IsUnique();

        builder.Property(p => p.TourScope)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.MinDaysBeforeDeparture)
            .IsRequired();

        builder.Property(p => p.MaxDaysBeforeDeparture)
            .IsRequired();

        builder.Property(p => p.PenaltyPercentage)
            .IsRequired()
            .HasPrecision(5, 2);

        builder.Property(p => p.ApplyOn)
            .HasMaxLength(50)
            .HasDefaultValue("FullAmount");

        builder.Property(p => p.Status)
            .HasConversion<string>()
            .HasMaxLength(50)
            .HasDefaultValue(Domain.Enums.CancellationPolicyStatus.Active)
            .IsRequired();

        builder.Property(p => p.IsDeleted)
            .HasDefaultValue(false);

        // Composite index for efficient policy lookup
        builder.HasIndex(p => new { p.TourScope, p.MinDaysBeforeDeparture, p.MaxDaysBeforeDeparture, p.Status, p.IsDeleted });
        builder.HasIndex(p => new { p.Status, p.IsDeleted });
        builder.HasIndex(p => p.CreatedOnUtc);
    }
}
