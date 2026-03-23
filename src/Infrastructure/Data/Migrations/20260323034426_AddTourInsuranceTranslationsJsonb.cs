using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.src.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTourInsuranceTranslationsJsonb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Translations",
                table: "TourInsurances",
                type: "jsonb",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Translations",
                table: "TourInsurances");
        }
    }
}
