using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceTourClassificationTierPricesWithBasePrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AdultPrice",
                table: "TourClassifications",
                newName: "BasePrice");

            migrationBuilder.DropColumn(
                name: "ChildPrice",
                table: "TourClassifications");

            migrationBuilder.DropColumn(
                name: "InfantPrice",
                table: "TourClassifications");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BasePrice",
                table: "TourClassifications",
                newName: "AdultPrice");

            migrationBuilder.AddColumn<decimal>(
                name: "ChildPrice",
                table: "TourClassifications",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "InfantPrice",
                table: "TourClassifications",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
