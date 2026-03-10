using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTourDayTranslationsAndActivities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourDays_TourClassifications_TourClassificationId",
                table: "TourDays");

            migrationBuilder.RenameColumn(
                name: "TourClassificationId",
                table: "TourDays",
                newName: "ClassificationId");

            migrationBuilder.RenameIndex(
                name: "IX_TourDays_TourClassificationId",
                table: "TourDays",
                newName: "IX_TourDays_ClassificationId");

            migrationBuilder.AddForeignKey(
                name: "FK_TourDays_TourClassifications_ClassificationId",
                table: "TourDays",
                column: "ClassificationId",
                principalTable: "TourClassifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourDays_TourClassifications_ClassificationId",
                table: "TourDays");

            migrationBuilder.RenameColumn(
                name: "ClassificationId",
                table: "TourDays",
                newName: "TourClassificationId");

            migrationBuilder.RenameIndex(
                name: "IX_TourDays_ClassificationId",
                table: "TourDays",
                newName: "IX_TourDays_TourClassificationId");

            migrationBuilder.AddForeignKey(
                name: "FK_TourDays_TourClassifications_TourClassificationId",
                table: "TourDays",
                column: "TourClassificationId",
                principalTable: "TourClassifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
