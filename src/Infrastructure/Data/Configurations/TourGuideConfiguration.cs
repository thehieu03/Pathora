using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class TourGuideConfiguration : IEntityTypeConfiguration<TourGuideEntity>
{
    public void Configure(EntityTypeBuilder<TourGuideEntity> builder)
    {
        builder.ToTable("TourGuides");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.FullName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.NickName)
            .HasMaxLength(100);

        builder.Property(x => x.Gender)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(x => x.Email)
            .HasMaxLength(200);

        builder.Property(x => x.Address)
            .HasMaxLength(500);

        builder.Property(x => x.LicenseNumber)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Languages)
            .HasMaxLength(2000);

        builder.Property(x => x.Specializations)
            .HasMaxLength(2000);

        builder.Property(x => x.ProfileImageUrl)
            .HasMaxLength(1000);

        builder.Property(x => x.YearsOfExperience)
            .HasDefaultValue(0)
            .IsRequired();

        builder.Property(x => x.Rating)
            .HasColumnType("numeric(3,2)");

        builder.Property(x => x.IsAvailable)
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(x => x.IsActive)
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(x => x.IsDeleted)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(x => x.Note)
            .HasMaxLength(1000);

        builder.HasIndex(x => x.LicenseNumber).IsUnique();
        builder.HasIndex(x => x.IsAvailable);
        builder.HasIndex(x => x.IsActive);
        builder.HasIndex(x => x.IsDeleted);
    }
}
