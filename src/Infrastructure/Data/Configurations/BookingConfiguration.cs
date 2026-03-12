using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<BookingEntity>
{
    public void Configure(EntityTypeBuilder<BookingEntity> builder)
    {
        builder.ToTable("Bookings");

        builder.HasKey(b => b.Id);

        // Customer info
        builder.Property(b => b.CustomerName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(b => b.CustomerPhone)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(b => b.CustomerEmail)
            .HasMaxLength(200);

        // Participants
        builder.Property(b => b.NumberAdult).IsRequired();
        builder.Property(b => b.NumberChild).HasDefaultValue(0);
        builder.Property(b => b.NumberInfant).HasDefaultValue(0);

        // Payment
        builder.Property(b => b.TotalPrice)
            .HasColumnType("numeric(18,2)")
            .IsRequired();

        builder.Property(b => b.PaymentMethod)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(b => b.IsFullPay).IsRequired();

        // Status & dates
        builder.Property(b => b.Status)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(b => b.BookingDate).IsRequired();

        builder.Property(b => b.CancelReason)
            .HasMaxLength(1000);

        // Indexes
        builder.HasIndex(b => b.Status);
        builder.HasIndex(b => b.TourInstanceId);
        builder.HasIndex(b => b.UserId);
        builder.HasIndex(b => b.BookingDate);

        // Relationships
        builder.HasOne(b => b.TourInstance)
            .WithMany()
            .HasForeignKey(b => b.TourInstanceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
