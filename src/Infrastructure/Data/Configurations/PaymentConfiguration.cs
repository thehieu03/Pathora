using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<PaymentEntity>
{
    public void Configure(EntityTypeBuilder<PaymentEntity> builder)
    {
        builder.ToTable("Payments");

        builder.HasKey(p => p.Id);

        // Transaction Info
        builder.Property(p => p.TransactionId)
            .HasMaxLength(100);

        builder.Property(p => p.Amount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(p => p.Currency)
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(p => p.PaymentDescription)
            .HasMaxLength(500);

        builder.Property(p => p.TransactionTimestamp)
            .IsRequired();

        // Party Info
        builder.Property(p => p.SenderName).HasMaxLength(200);
        builder.Property(p => p.SenderAccountNumber).HasMaxLength(50);
        builder.Property(p => p.ReceiverName).HasMaxLength(200);
        builder.Property(p => p.ReceiverAccountNumber).HasMaxLength(50);
        builder.Property(p => p.BeneficiaryBank).HasMaxLength(100);

        // Tax & Billing Info
        builder.Property(p => p.TaxCode).HasMaxLength(50);
        builder.Property(p => p.BillingAddress).HasMaxLength(500);

        builder.Property(p => p.TaxAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.TaxRate); 

        builder.HasIndex(p => p.TransactionId); // Tìm kiếm theo mã giao dịch
        builder.HasIndex(p => p.PaidUser);      // Lọc giao dịch theo người dùng
    }
}
