using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Tours_CreatedOnUtc",
                table: "Tours",
                column: "CreatedOnUtc");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_Status_IsDeleted",
                table: "Tours",
                columns: new[] { "Status", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_TourPlanLocations_City_Country",
                table: "TourPlanLocations",
                columns: new[] { "City", "Country" });

            migrationBuilder.CreateIndex(
                name: "IX_TourPlanLocations_LocationType",
                table: "TourPlanLocations",
                column: "LocationType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tours_CreatedOnUtc",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tours_Status_IsDeleted",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_TourPlanLocations_City_Country",
                table: "TourPlanLocations");

            migrationBuilder.DropIndex(
                name: "IX_TourPlanLocations_LocationType",
                table: "TourPlanLocations");
        }
    }
}
