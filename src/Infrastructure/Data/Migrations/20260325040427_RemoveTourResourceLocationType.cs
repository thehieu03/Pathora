using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations;

#pragma warning disable CA1862 // Use `StringComparison` method overloads for case-insensitive comparison

/// <inheritdoc />
public partial class RemoveTourResourceLocationType : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
            DELETE FROM ""TourResources""
            WHERE ""Type"" = 'Location';
        ");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // No-op: Location-type rows have already been deleted.
        // This down migration intentionally leaves them deleted.
    }
}
#pragma warning restore CA1862
