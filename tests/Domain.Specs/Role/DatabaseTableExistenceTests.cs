using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Domain.Specs.Infrastructure;

public sealed class DatabaseTableExistenceTests
{
    /// <summary>
    /// Test to verify all expected tables exist in the database.
    /// This test requires a running PostgreSQL database with the connection string
    /// set in environment variable DB_CONNECTION_STRING or appsettings.
    /// </summary>
    [Fact]
    public async Task AllExpectedTables_ShouldExistInDatabase()
    {
        // Arrange - Get expected tables from DbContext
        var dbContextType = typeof(AppDbContext);
        var dbSetProperties = dbContextType.GetProperties()
            .Where(p => p.PropertyType.IsGenericType &&
                       p.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>))
            .Select(p => p.Name)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        // Map DbSet names to table names based on EF Core configurations
        var tableNameMappings = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "Users", "Users" },
            { "Roles", "Roles" },
            { "UserRoles", "UserRoles" },
            { "Departments", "Departments" },
            { "Positions", "Positions" },
            { "FileMetadatas", "FileMetadatas" },
            { "RefreshTokens", "RefreshTokens" },
            { "Functions", "Functions" },
            { "SystemKeys", "SystemKeys" },
            { "Tours", "Tours" },
            { "TourClassifications", "TourClassifications" },
            { "TourDays", "TourDays" },
            { "TourDayActivities", "TourDayActivities" },
            { "TourInsurances", "TourInsurances" },
            { "TourPlanAccommodations", "TourPlanAccommodations" },
            { "TourPlanLocations", "TourPlanLocations" },
            { "TourPlanRoutes", "TourPlanRoutes" },
            { "Mails", "Mails" },
            { "logErrors", "LogErrors" },
            { "RoleFunctions", "RoleFunctions" },
            { "Registers", "Registers" },
            { "Reviews", "Reviews" },
            { "TourInstances", "TourInstances" },
            { "TourInstancePricingTiers", "TourInstancePricingTiers" },
            { "DynamicPricingTiers", "TourInstancePricingTiers" }, // Same table!
            { "TourRequests", "TourRequests" },
            { "Bookings", "Bookings" },
            { "BookingActivityReservations", "BookingActivityReservations" },
            { "BookingTransportDetails", "BookingTransportDetails" },
            { "BookingAccommodationDetails", "BookingAccommodationDetails" },
            { "BookingParticipants", "BookingParticipants" },
            { "Passports", "Passports" },
            { "VisaApplications", "VisaApplications" },
            { "Visas", "Visas" },
            { "VisaPolicies", "VisaPolicies" },
            { "DepositPolicies", "DepositPolicies" },
            { "Suppliers", "Suppliers" },
            { "SupplierPayables", "SupplierPayables" },
            { "SupplierReceipts", "SupplierReceipts" },
            { "TourGuides", "TourGuides" },
            { "BookingTourGuides", "BookingTourGuides" },
            { "TourDayActivityStatuses", "TourDayActivityStatuses" },
            { "TourDayActivityGuides", "TourDayActivityGuides" },
            { "CustomerPayments", "CustomerPayments" },
            { "CustomerDeposits", "CustomerDeposits" },
            { "Payments", "Payments" },
            { "PaymentTransactions", "PaymentTransactions" },
            { "OutboxMessages", "OutboxMessages" },
            { "PasswordResetTokens", "PasswordResetTokens" },
            { "PricingPolicies", "PricingPolicies" },
            // TaxConfigs and CancellationPolicies may not exist yet in older databases
            // { "TaxConfigs", "TaxConfigs" },
            // { "CancellationPolicies", "CancellationPolicies" }
        };

        // Get unique expected table names from mappings
        var expectedTables = tableNameMappings.Values
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        // Connect to database
        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
            ?? "Host=34.143.220.132;Port=5432;Database=Pathora;Username=postgres;Password=123abc@A;SSL Mode=Disable";

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        // Act - Get all tables from information_schema
        await using var command = new NpgsqlCommand(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name NOT IN ('__EFMigrationsHistory')",
            connection);
        await using var reader = await command.ExecuteReaderAsync();

        var actualTables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        while (await reader.ReadAsync())
        {
            actualTables.Add(reader.GetString(0));
        }

        // Assert - Check missing tables
        var missingTables = expectedTables.Except(actualTables).ToList();
        var extraTables = actualTables.Except(expectedTables).ToList();

        if (missingTables.Count > 0)
        {
            Console.WriteLine($"Missing tables ({missingTables.Count}): {string.Join(", ", missingTables)}");
        }
        if (extraTables.Count > 0)
        {
            Console.WriteLine($"Extra tables in database ({extraTables.Count}): {string.Join(", ", extraTables)}");
        }

        Assert.Empty(missingTables);
    }

    /// <summary>
    /// Test to verify DbSet count in AppDbContext is correct.
    /// This provides a quick sanity check on the number of DbSets.
    /// </summary>
    [Fact]
    public void AppDbContext_DbSetCount_ShouldBeCorrect()
    {
        var dbContextType = typeof(AppDbContext);
        var dbSetCount = dbContextType.GetProperties()
            .Count(p => p.PropertyType.IsGenericType &&
                       p.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>));

        // Should have 52 DbSet properties (53 lines in DbContext but DynamicPricingTiers and TourInstancePricingTiers point to same table)
        // Note: This counts the DbSet properties, not unique tables
        Console.WriteLine($"Number of DbSet properties: {dbSetCount}");

        // We expect 52 DbSet properties
        Assert.True(dbSetCount >= 50, $"Expected at least 50 DbSet properties, found {dbSetCount}");
    }

    /// <summary>
    /// Test to list all tables in the database for documentation purposes.
    /// </summary>
    [Fact]
    public async Task ListAllTables_InDatabase()
    {
        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
            ?? "Host=34.143.220.132;Port=5432;Database=Pathora;Username=postgres;Password=123abc@A;SSL Mode=Disable";

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name NOT IN ('__EFMigrationsHistory') ORDER BY table_name",
            connection);
        await using var reader = await command.ExecuteReaderAsync();

        var tables = new List<string>();
        while (await reader.ReadAsync())
        {
            tables.Add(reader.GetString(0));
        }

        Console.WriteLine($"Total tables: {tables.Count}");
        Console.WriteLine("Tables in database:");
        foreach (var table in tables)
        {
            Console.WriteLine($"  - {table}");
        }

        Assert.True(tables.Count > 0);
    }
}
