using Domain.Abstractions;
using Domain.Entities;
using Domain.Mails;
using Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditableEntities();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateAuditableEntities()
    {
        foreach (var entry in ChangeTracker.Entries<IAuditable>())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity.CreatedOnUtc == default)
                    entry.Entity.CreatedOnUtc = DateTimeOffset.UtcNow;

                if (entry.Entity.LastModifiedOnUtc is null)
                    entry.Entity.LastModifiedOnUtc = DateTimeOffset.UtcNow;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Entity.LastModifiedOnUtc = DateTimeOffset.UtcNow;
            }
        }
    }

    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<RoleEntity> Roles => Set<RoleEntity>();
    public DbSet<UserRoleEntity> UserRoles => Set<UserRoleEntity>();
    public DbSet<DepartmentEntity> Departments => Set<DepartmentEntity>();
    public DbSet<PositionEntity> Positions => Set<PositionEntity>();
    public DbSet<FileMetadataEntity> FileMetadatas => Set<FileMetadataEntity>();
    public DbSet<RefreshTokenEntity> RefreshTokens => Set<RefreshTokenEntity>();
    public DbSet<Domain.Constant.Function> Functions => Set<Domain.Constant.Function>();
    public DbSet<Domain.Constant.SystemKey> SystemKeys => Set<Domain.Constant.SystemKey>();
    public DbSet<TourEntity> Tours => Set<TourEntity>();
    public DbSet<TourClassificationEntity> TourClassifications => Set<TourClassificationEntity>();
    public DbSet<TourDayEntity> TourDays => Set<TourDayEntity>();
    public DbSet<TourDayActivityEntity> TourDayActivities => Set<TourDayActivityEntity>();
    public DbSet<TourInsuranceEntity> TourInsurances => Set<TourInsuranceEntity>();
    public DbSet<TourPlanAccommodationEntity> TourPlanAccommodations => Set<TourPlanAccommodationEntity>();
    public DbSet<TourPlanLocationEntity> TourPlanLocations => Set<TourPlanLocationEntity>();
    public DbSet<TourPlanRouteEntity> TourPlanRoutes => Set<TourPlanRouteEntity>();
    public DbSet<MailEntity> Mails => Set<MailEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
