using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class PaymentTransactionConfiguration : IEntityTypeConfiguration<PaymentTransactionEntity>
{
    public void Configure(EntityTypeBuilder<PaymentTransactionEntity> builder)
    {
        builder.ToTable("PaymentTransactions");

        // Primary key
        builder.HasKey(x => x.Id);

        // Transaction identification
        builder.Property(x => x.TransactionCode)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(x => x.TransactionCode)
            .IsUnique();

        builder.Property(x => x.ExternalTransactionId)
            .HasMaxLength(255);

        builder.Property(x => x.PayOSOrderCode)
            .HasMaxLength(50);

        builder.HasIndex(x => x.PayOSOrderCode);

        // Transaction type & status
        builder.Property(x => x.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(x => x.Status)
            .IsRequired()
            .HasConversion<int>();

        // Amount
        builder.Property(x => x.Amount)
            .HasPrecision(18, 2);

        builder.Property(x => x.PaidAmount)
            .HasPrecision(18, 2);

        builder.Property(x => x.RemainingAmount)
            .HasPrecision(18, 2);

        // Payment method
        builder.Property(x => x.PaymentMethod)
            .IsRequired()
            .HasConversion<int>();

        // Timing
        builder.Property(x => x.ExpiredAt);
        builder.Property(x => x.PaidAt);
        builder.Property(x => x.CompletedAt);

        // QR Code info
        builder.Property(x => x.QRCodeUrl)
            .HasMaxLength(500);

        builder.Property(x => x.PaymentNote)
            .HasMaxLength(500);

        // Bank info
        builder.Property(x => x.SenderName)
            .HasMaxLength(255);

        builder.Property(x => x.SenderAccountNumber)
            .HasMaxLength(50);

        builder.Property(x => x.BeneficiaryBank)
            .HasMaxLength(255);

        // Error tracking
        builder.Property(x => x.ErrorCode)
            .HasMaxLength(50);

        builder.Property(x => x.ErrorMessage)
            .HasMaxLength(500);

        builder.Property(x => x.LastProcessingError)
            .HasMaxLength(500);

        builder.Property(x => x.LastProcessedAt);

        // Metadata
        builder.Property(x => x.RetryCount)
            .HasDefaultValue(0);

        // Audit
        builder.Property(x => x.CreatedBy)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.LastModifiedBy)
            .HasMaxLength(255);

        // Foreign key to Booking
        builder.HasOne(x => x.Booking)
            .WithMany(x => x.PaymentTransactions)
            .HasForeignKey(x => x.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes for common query patterns
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.BookingId);
        builder.HasIndex(x => x.PaidAt);
        builder.HasIndex(x => new { x.Status, x.PaidAt });
    }
}
