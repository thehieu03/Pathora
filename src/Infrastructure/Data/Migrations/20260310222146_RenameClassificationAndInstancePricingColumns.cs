using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenameClassificationAndInstancePricingColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // TourInstances: rename BasePrice→AdultPrice, SellingPrice→ChildPrice, OperatingCost→InfantPrice
            migrationBuilder.RenameColumn(
                name: "BasePrice",
                table: "TourInstances",
                newName: "AdultPrice");

            migrationBuilder.RenameColumn(
                name: "SellingPrice",
                table: "TourInstances",
                newName: "ChildPrice");

            migrationBuilder.RenameColumn(
                name: "OperatingCost",
                table: "TourInstances",
                newName: "InfantPrice");

            // TourClassifications: rename Price→AdultPrice, SalePrice→ChildPrice, add InfantPrice
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "TourClassifications",
                newName: "AdultPrice");

            migrationBuilder.RenameColumn(
                name: "SalePrice",
                table: "TourClassifications",
                newName: "ChildPrice");

            migrationBuilder.AddColumn<decimal>(
                name: "InfantPrice",
                table: "TourClassifications",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            // TourClassifications: rename DurationDays→NumberOfDay, add NumberOfNight
            migrationBuilder.RenameColumn(
                name: "DurationDays",
                table: "TourClassifications",
                newName: "NumberOfDay");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfNight",
                table: "TourClassifications",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // TourInstances: reverse
            migrationBuilder.RenameColumn(
                name: "AdultPrice",
                table: "TourInstances",
                newName: "BasePrice");

            migrationBuilder.RenameColumn(
                name: "ChildPrice",
                table: "TourInstances",
                newName: "SellingPrice");

            migrationBuilder.RenameColumn(
                name: "InfantPrice",
                table: "TourInstances",
                newName: "OperatingCost");

            // TourClassifications: reverse
            migrationBuilder.RenameColumn(
                name: "AdultPrice",
                table: "TourClassifications",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "ChildPrice",
                table: "TourClassifications",
                newName: "SalePrice");

            migrationBuilder.DropColumn(
                name: "InfantPrice",
                table: "TourClassifications");

            migrationBuilder.RenameColumn(
                name: "NumberOfDay",
                table: "TourClassifications",
                newName: "DurationDays");

            migrationBuilder.DropColumn(
                name: "NumberOfNight",
                table: "TourClassifications");
        }
    }
}
