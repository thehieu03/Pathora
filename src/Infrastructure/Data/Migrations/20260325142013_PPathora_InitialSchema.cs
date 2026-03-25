using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class PPathora_InitialSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "TourResources",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedOnUtc",
                table: "TourResources",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TourResources",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "TourPlanRoutes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedOnUtc",
                table: "TourPlanRoutes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TourPlanRoutes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "TourPlanLocations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedOnUtc",
                table: "TourPlanLocations",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TourPlanLocations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "TourEntityId",
                table: "TourPlanLocations",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "TourPlanAccommodations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedOnUtc",
                table: "TourPlanAccommodations",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TourPlanAccommodations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "TourInsurances",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedOnUtc",
                table: "TourInsurances",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TourInsurances",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "TourDays",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedOnUtc",
                table: "TourDays",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TourDays",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "TourDayActivityResourceLinks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedOnUtc",
                table: "TourDayActivityResourceLinks",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TourDayActivityResourceLinks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "TourDayActivities",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedOnUtc",
                table: "TourDayActivities",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TourDayActivities",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "TourClassifications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedOnUtc",
                table: "TourClassifications",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TourClassifications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_TourPlanLocations_TourEntityId",
                table: "TourPlanLocations",
                column: "TourEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_TourPlanLocations_Tours_TourEntityId",
                table: "TourPlanLocations",
                column: "TourEntityId",
                principalTable: "Tours",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourPlanLocations_Tours_TourEntityId",
                table: "TourPlanLocations");

            migrationBuilder.DropIndex(
                name: "IX_TourPlanLocations_TourEntityId",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TourResources");

            migrationBuilder.DropColumn(
                name: "DeletedOnUtc",
                table: "TourResources");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TourResources");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TourPlanRoutes");

            migrationBuilder.DropColumn(
                name: "DeletedOnUtc",
                table: "TourPlanRoutes");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TourPlanRoutes");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "DeletedOnUtc",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "TourEntityId",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "DeletedOnUtc",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TourInsurances");

            migrationBuilder.DropColumn(
                name: "DeletedOnUtc",
                table: "TourInsurances");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TourInsurances");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TourDays");

            migrationBuilder.DropColumn(
                name: "DeletedOnUtc",
                table: "TourDays");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TourDays");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TourDayActivityResourceLinks");

            migrationBuilder.DropColumn(
                name: "DeletedOnUtc",
                table: "TourDayActivityResourceLinks");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TourDayActivityResourceLinks");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TourDayActivities");

            migrationBuilder.DropColumn(
                name: "DeletedOnUtc",
                table: "TourDayActivities");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TourDayActivities");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TourClassifications");

            migrationBuilder.DropColumn(
                name: "DeletedOnUtc",
                table: "TourClassifications");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TourClassifications");
        }
    }
}
