using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.src.Infrastructure.Data.Migrations;

public partial class ReplaceTourClassificationTierPricesWithBasePrice : Migration
{
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

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<decimal>(
            name: "AdultPrice",
            table: "TourClassifications",
            type: "numeric(18,2)",
            nullable: false,
            defaultValue: 0m);

        migrationBuilder.AddColumn<decimal>(
            name: "ChildPrice",
            table: "TourClassifications",
            type: "numeric(18,2)",
            nullable: false,
            defaultValue: 0m);

        migrationBuilder.RenameColumn(
            name: "BasePrice",
            table: "TourClassifications",
            newName: "InfantPrice");
    }
}
