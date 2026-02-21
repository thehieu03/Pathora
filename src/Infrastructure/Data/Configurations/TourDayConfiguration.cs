using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class TourDayConfiguration : IEntityTypeConfiguration<TourDayEntity>
{
    public void Configure(EntityTypeBuilder<TourDayEntity> builder)
    {
        builder.ToTable("TourDays");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.ClassificationId)
            .IsRequired();

        builder.Property(d => d.DayNumber)
            .IsRequired();

        builder.Property(d => d.Title)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(d => d.Description)
            .IsRequired();

        builder.Property(d => d.AccommodationName)
            .HasMaxLength(300);

        builder.Property(d => d.AccommodationNote)
            .HasMaxLength(500);

        builder.HasMany(d => d.Activities)
            .WithOne(a => a.TourDay)
            .HasForeignKey(a => a.TourDayId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
