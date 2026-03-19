using System.Text.Json;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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

        // Translations as JSONB with explicit conversion
        builder.Property(p => p.Translations)
            .HasColumnType("jsonb")
            .HasConversion(
                value => JsonSerializer.Serialize(value, (JsonSerializerOptions?)null),
                value => JsonSerializer.Deserialize<Dictionary<string, Domain.Entities.Translations.CancellationPolicyTranslationData>>(value, (JsonSerializerOptions?)null) ?? new Dictionary<string, Domain.Entities.Translations.CancellationPolicyTranslationData>(),
                new ValueComparer<Dictionary<string, Domain.Entities.Translations.CancellationPolicyTranslationData>>(
                    (left, right) => JsonSerializer.Serialize(left) == JsonSerializer.Serialize(right),
                    value => JsonSerializer.Serialize(value).GetHashCode(),
                    value => JsonSerializer.Deserialize<Dictionary<string, Domain.Entities.Translations.CancellationPolicyTranslationData>>(JsonSerializer.Serialize(value)) ?? new Dictionary<string, Domain.Entities.Translations.CancellationPolicyTranslationData>()));

        // Composite index for efficient policy lookup
        builder.HasIndex(p => new { p.TourScope, p.MinDaysBeforeDeparture, p.MaxDaysBeforeDeparture, p.Status, p.IsDeleted });
        builder.HasIndex(p => new { p.Status, p.IsDeleted });
        builder.HasIndex(p => p.CreatedOnUtc);
    }
}
