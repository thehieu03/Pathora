using System.Text.RegularExpressions;

namespace Domain.Specs.Infrastructure;

public sealed class BookingManagementBackfillScriptTests
{
    [Fact]
    public void BackfillSupplierScript_ShouldExistAndContainIdempotentGuards()
    {
        var scriptPath = Path.Combine(GetSolutionRoot(), "src", "Infrastructure.DatabaseMigration", "scripts", "Script0002-BackfillSuppliersFromLegacyBookingData.sql");

        Assert.True(File.Exists(scriptPath));

        var content = File.ReadAllText(scriptPath);
        Assert.Contains("information_schema.tables", content, StringComparison.Ordinal);
        Assert.Contains("INSERT INTO \"Suppliers\"", content, StringComparison.Ordinal);
        Assert.Contains("ON CONFLICT", content, StringComparison.Ordinal);
    }

    [Fact]
    public void BackfillActivityReservationScript_ShouldExistAndContainLegacyGuardChecks()
    {
        var scriptPath = Path.Combine(GetSolutionRoot(), "src", "Infrastructure.DatabaseMigration", "scripts", "Script0003-BackfillBookingActivityReservationsFromLegacyData.sql");

        Assert.True(File.Exists(scriptPath));

        var content = File.ReadAllText(scriptPath);
        Assert.Contains("information_schema.tables", content, StringComparison.Ordinal);
        Assert.Contains("INSERT INTO \"BookingActivityReservations\"", content, StringComparison.Ordinal);
        Assert.Contains("NOT EXISTS", content, StringComparison.Ordinal);
    }

    [Fact]
    public void BookingManagementMigrations_ShouldProvideRollbackForCreatedTables()
    {
        var migrationDirectory = Path.Combine(GetSolutionRoot(), "src", "Infrastructure", "Data", "Migrations");

        AssertMigrationDropsTable(migrationDirectory, "AddSupplierEntity", "Suppliers");
        AssertMigrationDropsTable(migrationDirectory, "AddBookingActivityReservations", "BookingActivityReservations");
        AssertMigrationDropsTable(migrationDirectory, "AddBookingTransportAndAccommodationDetails", "BookingTransportDetails");
        AssertMigrationDropsTable(migrationDirectory, "AddBookingTransportAndAccommodationDetails", "BookingAccommodationDetails");
        AssertMigrationDropsTable(migrationDirectory, "AddBookingParticipantsTravelDocumentsAndSupplierPayables", "BookingParticipants");
    }

    private static void AssertMigrationDropsTable(string migrationDirectory, string migrationNameFragment, string tableName)
    {
        var migrationFile = Directory.GetFiles(migrationDirectory, "*.cs")
            .Where(path =>
                !path.EndsWith(".Designer.cs", StringComparison.OrdinalIgnoreCase) &&
                !path.EndsWith("AppDbContextModelSnapshot.cs", StringComparison.OrdinalIgnoreCase))
            .FirstOrDefault(path => Path.GetFileName(path).Contains(migrationNameFragment, StringComparison.Ordinal));

        Assert.NotNull(migrationFile);

        var content = File.ReadAllText(migrationFile!);
        var pattern = $"DropTable\\(\\s*name:\\s*\"{tableName}\"";
        Assert.True(Regex.IsMatch(content, pattern, RegexOptions.CultureInvariant));
    }

    private static string GetSolutionRoot()
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);
        while (current is not null)
        {
            var marker = Path.Combine(current.FullName, "LocalService.slnx");
            if (File.Exists(marker))
            {
                return current.FullName;
            }

            current = current.Parent;
        }

        throw new InvalidOperationException("Could not locate LocalService.slnx from test execution path.");
    }
}
