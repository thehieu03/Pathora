using System.Text.Json;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class PricingPolicyConfiguration : IEntityTypeConfiguration<PricingPolicy>
{
    public void Configure(EntityTypeBuilder<PricingPolicy> builder)
    {
        builder.ToTable("PricingPolicies");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.PolicyCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(p => p.PolicyCode)
            .IsUnique();

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.TourType)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.Status)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.IsDefault)
            .HasDefaultValue(false);

        builder.Property(p => p.IsDeleted)
            .HasDefaultValue(false);

        // Tiers stored as JSON
        builder.Property(p => p.Tiers)
            .HasColumnType("jsonb")
            .HasConversion(
                value => JsonSerializer.Serialize(value, (JsonSerializerOptions?)null),
                value => JsonSerializer.Deserialize<List<Domain.ValueObjects.PricingPolicyTier>>(value, (JsonSerializerOptions?)null) ?? new List<Domain.ValueObjects.PricingPolicyTier>(),
                new ValueComparer<List<Domain.ValueObjects.PricingPolicyTier>>(
                    (left, right) => JsonSerializer.Serialize(left) == JsonSerializer.Serialize(right),
                    value => JsonSerializer.Serialize(value).GetHashCode(),
                    value => JsonSerializer.Deserialize<List<Domain.ValueObjects.PricingPolicyTier>>(JsonSerializer.Serialize(value)) ?? new List<Domain.ValueObjects.PricingPolicyTier>()));

        builder.HasIndex(p => new { p.Status, p.IsDeleted });
        builder.HasIndex(p => p.IsDefault);
        builder.HasIndex(p => p.CreatedOnUtc);
    }
}
