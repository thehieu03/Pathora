using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class TourInstanceConfiguration : IEntityTypeConfiguration<TourInstanceEntity>
{
    public void Configure(EntityTypeBuilder<TourInstanceEntity> builder)
    {
        builder.ToTable("TourInstances");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.TourName)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(t => t.TourCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(t => t.ClassificationName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Location)
            .HasMaxLength(500);

        builder.Property(t => t.Category)
            .HasMaxLength(200);

        builder.Property(t => t.InstanceType)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(t => t.Status)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(t => t.StartDate).IsRequired();
        builder.Property(t => t.EndDate).IsRequired();
        builder.Property(t => t.DurationDays).IsRequired();

        builder.Property(t => t.MinParticipants).IsRequired();
        builder.Property(t => t.MaxParticipants).IsRequired();
        builder.Property(t => t.RegisteredParticipants).HasDefaultValue(0);

        builder.Property(t => t.Price)
            .HasColumnType("numeric(18,2)")
            .IsRequired();

        builder.Property(t => t.SalePrice)
            .HasColumnType("numeric(18,2)")
            .IsRequired();

        builder.Property(t => t.IsDeleted)
            .HasDefaultValue(false);

        // IncludedServices as JSON column
        builder.Property(t => t.IncludedServices)
            .HasColumnType("jsonb");

        // Guide as owned JSON column
        builder.OwnsOne(t => t.Guide, guide =>
        {
            guide.ToJson();
        });

        // Thumbnail as owned inline
        builder.OwnsOne(t => t.Thumbnail, thumb =>
        {
            thumb.Property(i => i.FileId).HasColumnName("Thumbnail_FileId").HasMaxLength(200);
            thumb.Property(i => i.OriginalFileName).HasColumnName("Thumbnail_OriginalFileName").HasMaxLength(500);
            thumb.Property(i => i.FileName).HasColumnName("Thumbnail_FileName").HasMaxLength(500);
            thumb.Property(i => i.PublicURL).HasColumnName("Thumbnail_PublicURL").HasMaxLength(1000);
        });

        // Indexes
        builder.HasIndex(t => new { t.Status, t.InstanceType });
        builder.HasIndex(t => t.TourId);
        builder.HasIndex(t => t.StartDate);
        builder.HasIndex(t => t.IsDeleted)
            .HasFilter("\"IsDeleted\" = false");

        // Relationships
        builder.HasOne(t => t.Tour)
            .WithMany()
            .HasForeignKey(t => t.TourId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Classification)
            .WithMany()
            .HasForeignKey(t => t.ClassificationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(t => t.DynamicPricingTiers)
            .WithOne(d => d.TourInstance)
            .HasForeignKey(d => d.TourInstanceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
