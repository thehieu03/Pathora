using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakeTourPlanRouteLocationFkNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourPlanLocations_TourDayActivities_TourDayActivityId",
                table: "TourPlanLocations");

            migrationBuilder.AddColumn<Guid>(
                name: "FromLocationId",
                table: "TourResources",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ToLocationId",
                table: "TourResources",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ToLocationId",
                table: "TourPlanRoutes",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "FromLocationId",
                table: "TourPlanRoutes",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "TourDayActivityId",
                table: "TourPlanLocations",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "TourId",
                table: "TourPlanLocations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_TourResources_FromLocationId",
                table: "TourResources",
                column: "FromLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_TourResources_ToLocationId",
                table: "TourResources",
                column: "ToLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_TourPlanLocations_TourId",
                table: "TourPlanLocations",
                column: "TourId");

            migrationBuilder.AddForeignKey(
                name: "FK_TourPlanLocations_TourDayActivities_TourDayActivityId",
                table: "TourPlanLocations",
                column: "TourDayActivityId",
                principalTable: "TourDayActivities",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_TourPlanLocations_Tours_TourId",
                table: "TourPlanLocations",
                column: "TourId",
                principalTable: "Tours",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TourResources_TourPlanLocations_FromLocationId",
                table: "TourResources",
                column: "FromLocationId",
                principalTable: "TourPlanLocations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TourResources_TourPlanLocations_ToLocationId",
                table: "TourResources",
                column: "ToLocationId",
                principalTable: "TourPlanLocations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourPlanLocations_TourDayActivities_TourDayActivityId",
                table: "TourPlanLocations");

            migrationBuilder.DropForeignKey(
                name: "FK_TourPlanLocations_Tours_TourId",
                table: "TourPlanLocations");

            migrationBuilder.DropForeignKey(
                name: "FK_TourResources_TourPlanLocations_FromLocationId",
                table: "TourResources");

            migrationBuilder.DropForeignKey(
                name: "FK_TourResources_TourPlanLocations_ToLocationId",
                table: "TourResources");

            migrationBuilder.DropIndex(
                name: "IX_TourResources_FromLocationId",
                table: "TourResources");

            migrationBuilder.DropIndex(
                name: "IX_TourResources_ToLocationId",
                table: "TourResources");

            migrationBuilder.DropIndex(
                name: "IX_TourPlanLocations_TourId",
                table: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "FromLocationId",
                table: "TourResources");

            migrationBuilder.DropColumn(
                name: "ToLocationId",
                table: "TourResources");

            migrationBuilder.DropColumn(
                name: "TourId",
                table: "TourPlanLocations");

            migrationBuilder.AlterColumn<Guid>(
                name: "ToLocationId",
                table: "TourPlanRoutes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "FromLocationId",
                table: "TourPlanRoutes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "TourDayActivityId",
                table: "TourPlanLocations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TourPlanLocations_TourDayActivities_TourDayActivityId",
                table: "TourPlanLocations",
                column: "TourDayActivityId",
                principalTable: "TourDayActivities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
