using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTourEntitiesAndFixNaming : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourDays_TourClassifications_TourDayId",
                table: "TourDays");

            migrationBuilder.DropColumn(
                name: "TourPlanRouteId",
                table: "TourPlanRoutes");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "TourPlanAccommodationId",
                table: "TourPlanAccommodations");

            migrationBuilder.RenameColumn(
                name: "Avatar",
                table: "Users",
                newName: "AvatarUrl");

            migrationBuilder.RenameColumn(
                name: "CoverageDesciption",
                table: "TourInsurances",
                newName: "CoverageDescription");

            migrationBuilder.RenameColumn(
                name: "TourInsuranceId",
                table: "TourInsurances",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "TourDayId",
                table: "TourDays",
                newName: "TourClassificationId");

            migrationBuilder.RenameIndex(
                name: "IX_TourDays_TourDayId",
                table: "TourDays",
                newName: "IX_TourDays_TourClassificationId");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VerifyStatus",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "BookingReference",
                table: "TourPlanRoutes",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DistanceKm",
                table: "TourPlanRoutes",
                type: "numeric(10,2)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LocationDescription",
                table: "TourPlanLocations",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "ClosingHours",
                table: "TourPlanLocations",
                type: "time without time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EstimatedDurationMinutes",
                table: "TourPlanLocations",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "OpeningHours",
                table: "TourPlanLocations",
                type: "time without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "TourPlanAccommodations",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "TourPlanAccommodations",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "TourPlanAccommodations",
                type: "numeric(10,7)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "TourPlanAccommodations",
                type: "numeric(10,7)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfNights",
                table: "TourPlanAccommodations",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfRooms",
                table: "TourPlanAccommodations",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalPrice",
                table: "TourPlanAccommodations",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "TourPlanAccommodations",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "TourInsurances",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedOnUtc",
                table: "TourInsurances",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<string>(
                name: "LastModifiedBy",
                table: "TourInsurances",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastModifiedOnUtc",
                table: "TourInsurances",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "EstimatedCost",
                table: "TourDayActivities",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOptional",
                table: "TourDayActivities",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_TourDays_TourClassifications_TourClassificationId",
                table: "TourDays",
                column: "TourClassificationId",
                principalTable: "TourClassifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourDays_TourClassifications_TourClassificationId",
                table: "TourDays");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "VerifyStatus",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BookingReference",
                table: "TourPlanRoutes");

            migrationBuilder.DropColumn(
                name: "DistanceKm",
                table: "TourPlanRoutes");

            migrationBuilder.DropColumn(
                name: "ClosingHours",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "EstimatedDurationMinutes",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "OpeningHours",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "City",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "NumberOfNights",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "NumberOfRooms",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "TourPlanAccommodations");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "TourInsurances");

            migrationBuilder.DropColumn(
                name: "CreatedOnUtc",
                table: "TourInsurances");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "TourInsurances");

            migrationBuilder.DropColumn(
                name: "LastModifiedOnUtc",
                table: "TourInsurances");

            migrationBuilder.DropColumn(
                name: "EstimatedCost",
                table: "TourDayActivities");

            migrationBuilder.DropColumn(
                name: "IsOptional",
                table: "TourDayActivities");

            migrationBuilder.RenameColumn(
                name: "AvatarUrl",
                table: "Users",
                newName: "Avatar");

            migrationBuilder.RenameColumn(
                name: "CoverageDescription",
                table: "TourInsurances",
                newName: "CoverageDesciption");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "TourInsurances",
                newName: "TourInsuranceId");

            migrationBuilder.RenameColumn(
                name: "TourClassificationId",
                table: "TourDays",
                newName: "TourDayId");

            migrationBuilder.RenameIndex(
                name: "IX_TourDays_TourClassificationId",
                table: "TourDays",
                newName: "IX_TourDays_TourDayId");

            migrationBuilder.AddColumn<Guid>(
                name: "TourPlanRouteId",
                table: "TourPlanRoutes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<string>(
                name: "LocationDescription",
                table: "TourPlanLocations",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "LocationId",
                table: "TourPlanLocations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "TourPlanAccommodationId",
                table: "TourPlanAccommodations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddForeignKey(
                name: "FK_TourDays_TourClassifications_TourDayId",
                table: "TourDays",
                column: "TourDayId",
                principalTable: "TourClassifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
