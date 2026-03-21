using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations;

public partial class CancellationPolicy_TiersRedesign : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Step 1: Add Tiers jsonb column with empty array default (EF scaffolded)
        migrationBuilder.AddColumn<string>(
            name: "Tiers",
            table: "CancellationPolicies",
            type: "jsonb",
            nullable: false,
            defaultValue: "[]");

        // Step 2: Migrate existing data from flat columns to Tiers JSONB
        // Each existing row: convert MinDays, MaxDays, PenaltyPercentage to a single tier JSONB object
        migrationBuilder.Sql(@"
            UPDATE ""CancellationPolicies""
            SET ""Tiers"" = jsonb_build_array(
                jsonb_build_object(
                    'MinDaysBeforeDeparture', COALESCE(""MinDaysBeforeDeparture"", 0),
                    'MaxDaysBeforeDeparture', COALESCE(""MaxDaysBeforeDeparture"", 2147483647),
                    'PenaltyPercentage', COALESCE(""PenaltyPercentage"", 0)
                )
            )
            WHERE ""Tiers"" = '[]'::jsonb OR ""Tiers"" IS NULL;
        ");

        // Step 3: Drop old flat columns
        migrationBuilder.DropColumn(name: "ApplyOn", table: "CancellationPolicies");
        migrationBuilder.DropColumn(name: "MaxDaysBeforeDeparture", table: "CancellationPolicies");
        migrationBuilder.DropColumn(name: "MinDaysBeforeDeparture", table: "CancellationPolicies");
        migrationBuilder.DropColumn(name: "PenaltyPercentage", table: "CancellationPolicies");

        // Step 4: Drop old index
        migrationBuilder.DropIndex(
            name: "IX_CancellationPolicies_TourScope_MinDaysBeforeDeparture_MaxDa~",
            table: "CancellationPolicies");

        // Step 5: Create new index on TourScope + Status + IsDeleted
        migrationBuilder.CreateIndex(
            name: "IX_CancellationPolicies_TourScope_Status_IsDeleted",
            table: "CancellationPolicies",
            columns: new[] { "TourScope", "Status", "IsDeleted" });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_CancellationPolicies_TourScope_Status_IsDeleted",
            table: "CancellationPolicies");

        migrationBuilder.AddColumn<string>(
            name: "ApplyOn",
            table: "CancellationPolicies",
            type: "character varying(50)",
            maxLength: 50,
            nullable: false,
            defaultValue: "FullAmount");

        migrationBuilder.AddColumn<int>(
            name: "MaxDaysBeforeDeparture",
            table: "CancellationPolicies",
            type: "integer",
            nullable: false,
            defaultValue: 0);

        migrationBuilder.AddColumn<int>(
            name: "MinDaysBeforeDeparture",
            table: "CancellationPolicies",
            type: "integer",
            nullable: false,
            defaultValue: 0);

        migrationBuilder.AddColumn<decimal>(
            name: "PenaltyPercentage",
            table: "CancellationPolicies",
            type: "numeric(5,2)",
            precision: 5,
            scale: 2,
            nullable: false,
            defaultValue: 0m);

        migrationBuilder.DropColumn(name: "Tiers", table: "CancellationPolicies");

        migrationBuilder.CreateIndex(
            name: "IX_CancellationPolicies_TourScope_MinDaysBeforeDeparture_MaxDa~",
            table: "CancellationPolicies",
            columns: new[] { "TourScope", "MinDaysBeforeDeparture", "MaxDaysBeforeDeparture", "Status", "IsDeleted" });
    }
}
