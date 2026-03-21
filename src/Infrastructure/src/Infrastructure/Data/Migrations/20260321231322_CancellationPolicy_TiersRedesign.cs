using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.src.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class CancellationPolicy_TiersRedesign : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CancellationPolicies_TourScope_MinDaysBeforeDeparture_MaxDa~",
                table: "CancellationPolicies");

            migrationBuilder.DropColumn(
                name: "ApplyOn",
                table: "CancellationPolicies");

            migrationBuilder.DropColumn(
                name: "MaxDaysBeforeDeparture",
                table: "CancellationPolicies");

            migrationBuilder.DropColumn(
                name: "MinDaysBeforeDeparture",
                table: "CancellationPolicies");

            migrationBuilder.DropColumn(
                name: "PenaltyPercentage",
                table: "CancellationPolicies");

            migrationBuilder.AddColumn<string>(
                name: "Tiers",
                table: "CancellationPolicies",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

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

            migrationBuilder.DropColumn(
                name: "Tiers",
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

            migrationBuilder.CreateIndex(
                name: "IX_CancellationPolicies_TourScope_MinDaysBeforeDeparture_MaxDa~",
                table: "CancellationPolicies",
                columns: new[] { "TourScope", "MinDaysBeforeDeparture", "MaxDaysBeforeDeparture", "Status", "IsDeleted" });
        }
    }
}
