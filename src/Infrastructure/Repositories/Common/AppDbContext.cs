using Microsoft.EntityFrameworkCore;

using Domain.Entities;

namespace Infrastructure.Repositories.Common;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<DepartmentEntity> Departments => Set<DepartmentEntity>();
    public DbSet<Position> Positions => Set<Position>();
    public DbSet<FileMetadata> FileMetadatas => Set<FileMetadata>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Domain.Constant.Function> Functions => Set<Domain.Constant.Function>();
    public DbSet<Domain.Constant.SystemKey> SystemKeys => Set<Domain.Constant.SystemKey>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Password).IsRequired();
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Username).IsUnique();
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Roles");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
        });

        modelBuilder.Entity<DepartmentEntity>(entity =>
        {
            entity.ToTable("Departments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
        });

        modelBuilder.Entity<Position>(entity =>
        {
            entity.ToTable("Positions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Note).HasMaxLength(1000);
        });

        modelBuilder.Entity<FileMetadata>(entity =>
        {
            entity.ToTable("FileMetadatas");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OriginalFileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.StoredFileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.MimeType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Url).IsRequired();
        });

        modelBuilder.Entity<Domain.Constant.Function>(entity =>
        {
            entity.ToTable("Functions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ApiUrl).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.ButtonShow).HasMaxLength(100);
        });

        modelBuilder.Entity<Domain.Constant.SystemKey>(entity =>
        {
            entity.ToTable("SystemKeys");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CodeKey).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasIndex(e => e.CodeKey);
        });
    }
}
