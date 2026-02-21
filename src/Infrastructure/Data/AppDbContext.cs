using Domain.Entities;
using Infrastructure.Data.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<RoleEntity> Roles => Set<RoleEntity>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<DepartmentEntity> Departments => Set<DepartmentEntity>();
    public DbSet<Position> Positions => Set<Position>();
    public DbSet<FileMetadata> FileMetadatas => Set<FileMetadata>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Domain.Constant.Function> Functions => Set<Domain.Constant.Function>();
    public DbSet<Domain.Constant.SystemKey> SystemKeys => Set<Domain.Constant.SystemKey>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
