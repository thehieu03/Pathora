using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameAttractionToTouristAttraction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """UPDATE "TourPlanLocations" SET "LocationType" = 'TouristAttraction' WHERE "LocationType" = 'Attraction'""");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """UPDATE "TourPlanLocations" SET "LocationType" = 'Attraction' WHERE "LocationType" = 'TouristAttraction'""");
        }
    }
}
