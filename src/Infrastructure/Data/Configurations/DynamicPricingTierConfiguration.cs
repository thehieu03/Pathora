using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class DynamicPricingTierConfiguration : IEntityTypeConfiguration<DynamicPricingTierEntity>
{
    public void Configure(EntityTypeBuilder<DynamicPricingTierEntity> builder)
    {
        builder.ToTable("TourInstancePricingTiers");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.MinParticipants).IsRequired();
        builder.Property(d => d.MaxParticipants).IsRequired();

        builder.Property(d => d.PricePerPerson)
            .HasColumnType("numeric(18,2)")
            .IsRequired();

        builder.HasIndex(d => d.TourInstanceId);
    }
}
