using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class DynamicPricingTierConfiguration : IEntityTypeConfiguration<DynamicPricingTierEntity>
{
    public void Configure(EntityTypeBuilder<DynamicPricingTierEntity> builder)
    {
        builder.ToTable("TourInstancePricingTiers", tableBuilder =>
        {
            tableBuilder.HasCheckConstraint(
                "CK_TourInstancePricingTiers_ExactlyOneOwner",
                "((\"TourInstanceId\" IS NOT NULL AND \"TourClassificationId\" IS NULL) OR (\"TourInstanceId\" IS NULL AND \"TourClassificationId\" IS NOT NULL))");

            tableBuilder.HasCheckConstraint(
                "CK_TourInstancePricingTiers_ValidRange",
                "(\"MinParticipants\" >= 1 AND \"MaxParticipants\" >= \"MinParticipants\")");
        });

        builder.HasKey(d => d.Id);

        builder.Property(d => d.TourClassificationId)
            .IsRequired(false);

        builder.Property(d => d.TourInstanceId)
            .IsRequired(false);

        builder.Property(d => d.MinParticipants).IsRequired();
        builder.Property(d => d.MaxParticipants).IsRequired();

        builder.Property(d => d.PricePerPerson)
            .HasColumnType("numeric(18,2)")
            .IsRequired();

        builder.HasIndex(d => new { d.TourInstanceId, d.MinParticipants, d.MaxParticipants })
            .HasFilter("\"TourInstanceId\" IS NOT NULL");

        builder.HasIndex(d => new { d.TourClassificationId, d.MinParticipants, d.MaxParticipants })
            .HasFilter("\"TourClassificationId\" IS NOT NULL");
    }
}
