using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RedesignTieredGroupDiscountPricing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TourInstancePricingTiers_TourInstanceId",
                table: "TourInstancePricingTiers");

            migrationBuilder.AlterColumn<Guid>(
                name: "TourInstanceId",
                table: "TourInstancePricingTiers",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "TourClassificationId",
                table: "TourInstancePricingTiers",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TourInstancePricingTiers_TourClassificationId_MinParticipan~",
                table: "TourInstancePricingTiers",
                columns: new[] { "TourClassificationId", "MinParticipants", "MaxParticipants" },
                filter: "\"TourClassificationId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_TourInstancePricingTiers_TourInstanceId_MinParticipants_Max~",
                table: "TourInstancePricingTiers",
                columns: new[] { "TourInstanceId", "MinParticipants", "MaxParticipants" },
                filter: "\"TourInstanceId\" IS NOT NULL");

            migrationBuilder.AddCheckConstraint(
                name: "CK_TourInstancePricingTiers_ExactlyOneOwner",
                table: "TourInstancePricingTiers",
                sql: "((\"TourInstanceId\" IS NOT NULL AND \"TourClassificationId\" IS NULL) OR (\"TourInstanceId\" IS NULL AND \"TourClassificationId\" IS NOT NULL))");

            migrationBuilder.AddCheckConstraint(
                name: "CK_TourInstancePricingTiers_ValidRange",
                table: "TourInstancePricingTiers",
                sql: "(\"MinParticipants\" >= 1 AND \"MaxParticipants\" >= \"MinParticipants\")");

            migrationBuilder.AddForeignKey(
                name: "FK_TourInstancePricingTiers_TourClassifications_TourClassifica~",
                table: "TourInstancePricingTiers",
                column: "TourClassificationId",
                principalTable: "TourClassifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourInstancePricingTiers_TourClassifications_TourClassifica~",
                table: "TourInstancePricingTiers");

            migrationBuilder.DropIndex(
                name: "IX_TourInstancePricingTiers_TourClassificationId_MinParticipan~",
                table: "TourInstancePricingTiers");

            migrationBuilder.DropIndex(
                name: "IX_TourInstancePricingTiers_TourInstanceId_MinParticipants_Max~",
                table: "TourInstancePricingTiers");

            migrationBuilder.DropCheckConstraint(
                name: "CK_TourInstancePricingTiers_ExactlyOneOwner",
                table: "TourInstancePricingTiers");

            migrationBuilder.DropCheckConstraint(
                name: "CK_TourInstancePricingTiers_ValidRange",
                table: "TourInstancePricingTiers");

            migrationBuilder.DropColumn(
                name: "TourClassificationId",
                table: "TourInstancePricingTiers");

            migrationBuilder.AlterColumn<Guid>(
                name: "TourInstanceId",
                table: "TourInstancePricingTiers",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TourInstancePricingTiers_TourInstanceId",
                table: "TourInstancePricingTiers",
                column: "TourInstanceId");
        }
    }
}
