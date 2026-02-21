using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class TourDayActivityConfiguration : IEntityTypeConfiguration<TourDayActivityEntity>
{
    public void Configure(EntityTypeBuilder<TourDayActivityEntity> builder)
    {
        builder.ToTable("TourDayActivities");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.TourDayId)
            .IsRequired();

        builder.Property(a => a.Order)
            .IsRequired();

        builder.Property(a => a.Destination)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(a => a.DestinationNote)
            .HasMaxLength(500);

        builder.Property(a => a.TransportationType)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(a => a.TransportationNote)
            .HasMaxLength(300);

        builder.Property(a => a.Description)
            .HasMaxLength(1000);

    }
}
