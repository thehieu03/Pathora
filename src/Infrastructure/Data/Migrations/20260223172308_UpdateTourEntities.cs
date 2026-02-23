using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTourEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourDays_TourClassifications_ClassificationId",
                table: "TourDays");

            migrationBuilder.DropColumn(
                name: "AccommodationName",
                table: "TourDays");

            migrationBuilder.DropColumn(
                name: "AccommodationNote",
                table: "TourDays");

            migrationBuilder.DropColumn(
                name: "DestinationNote",
                table: "TourDayActivities");

            migrationBuilder.DropColumn(
                name: "TransportationNote",
                table: "TourDayActivities");

            migrationBuilder.RenameColumn(
                name: "ClassificationId",
                table: "TourDays",
                newName: "TourDayId");

            migrationBuilder.RenameIndex(
                name: "IX_TourDays_ClassificationId",
                table: "TourDays",
                newName: "IX_TourDays_TourDayId");

            migrationBuilder.RenameColumn(
                name: "TransportationType",
                table: "TourDayActivities",
                newName: "ActivityType");

            migrationBuilder.RenameColumn(
                name: "Destination",
                table: "TourDayActivities",
                newName: "Title");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "TourDays",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "TourDayActivities",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "EndTime",
                table: "TourDayActivities",
                type: "time without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "TourDayActivities",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "StartTime",
                table: "TourDayActivities",
                type: "time without time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TourInsurances",
                columns: table => new
                {
                    TourInsuranceId = table.Column<Guid>(type: "uuid", nullable: false),
                    InsuranceName = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    InsuranceType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    InsuranceProvider = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    CoverageDesciption = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    CoverageAmount = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    CoverageFee = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    IsOptional = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    TourClassificationId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourInsurances", x => x.TourInsuranceId);
                    table.ForeignKey(
                        name: "FK_TourInsurances_TourClassifications_TourClassificationId",
                        column: x => x.TourClassificationId,
                        principalTable: "TourClassifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TourPlanAccommodations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourPlanAccommodationId = table.Column<Guid>(type: "uuid", nullable: false),
                    AccommodationName = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    CheckInTime = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    CheckOutTime = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    RoomType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RoomCapacity = table.Column<int>(type: "integer", nullable: false),
                    RoomPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    MealsIncluded = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SpecialRequest = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ContactPhone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    TourDayActivityId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourPlanAccommodations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourPlanAccommodations_TourDayActivities_TourDayActivityId",
                        column: x => x.TourDayActivityId,
                        principalTable: "TourDayActivities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TourPlanLocations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationName = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    LocationDescription = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    LocationType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    City = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Country = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Latitude = table.Column<decimal>(type: "numeric(10,7)", nullable: true),
                    Longitude = table.Column<decimal>(type: "numeric(10,7)", nullable: true),
                    EntranceFee = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    TourDayActivityId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourPlanLocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourPlanLocations_TourDayActivities_TourDayActivityId",
                        column: x => x.TourDayActivityId,
                        principalTable: "TourDayActivities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TourPlanRoutes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourPlanRouteId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    TransportationType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TransportationName = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    TransportationNote = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    FromLocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ToLocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    EstimatedDepartureTime = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    EstimatedArrivalTime = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    DurationMinutes = table.Column<int>(type: "integer", nullable: true),
                    Price = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    TourDayActivityId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourPlanRoutes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourPlanRoutes_TourDayActivities_TourDayActivityId",
                        column: x => x.TourDayActivityId,
                        principalTable: "TourDayActivities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TourPlanRoutes_TourPlanLocations_FromLocationId",
                        column: x => x.FromLocationId,
                        principalTable: "TourPlanLocations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TourPlanRoutes_TourPlanLocations_ToLocationId",
                        column: x => x.ToLocationId,
                        principalTable: "TourPlanLocations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TourInsurances_TourClassificationId",
                table: "TourInsurances",
                column: "TourClassificationId");

            migrationBuilder.CreateIndex(
                name: "IX_TourPlanAccommodations_TourDayActivityId",
                table: "TourPlanAccommodations",
                column: "TourDayActivityId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TourPlanLocations_TourDayActivityId",
                table: "TourPlanLocations",
                column: "TourDayActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_TourPlanRoutes_FromLocationId",
                table: "TourPlanRoutes",
                column: "FromLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_TourPlanRoutes_ToLocationId",
                table: "TourPlanRoutes",
                column: "ToLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_TourPlanRoutes_TourDayActivityId",
                table: "TourPlanRoutes",
                column: "TourDayActivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_TourDays_TourClassifications_TourDayId",
                table: "TourDays",
                column: "TourDayId",
                principalTable: "TourClassifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourDays_TourClassifications_TourDayId",
                table: "TourDays");

            migrationBuilder.DropTable(
                name: "TourInsurances");

            migrationBuilder.DropTable(
                name: "TourPlanAccommodations");

            migrationBuilder.DropTable(
                name: "TourPlanRoutes");

            migrationBuilder.DropTable(
                name: "TourPlanLocations");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "TourDayActivities");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "TourDayActivities");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "TourDayActivities");

            migrationBuilder.RenameColumn(
                name: "TourDayId",
                table: "TourDays",
                newName: "ClassificationId");

            migrationBuilder.RenameIndex(
                name: "IX_TourDays_TourDayId",
                table: "TourDays",
                newName: "IX_TourDays_ClassificationId");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "TourDayActivities",
                newName: "Destination");

            migrationBuilder.RenameColumn(
                name: "ActivityType",
                table: "TourDayActivities",
                newName: "TransportationType");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "TourDays",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AccommodationName",
                table: "TourDays",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AccommodationNote",
                table: "TourDays",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "TourDayActivities",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DestinationNote",
                table: "TourDayActivities",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TransportationNote",
                table: "TourDayActivities",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TourDays_TourClassifications_ClassificationId",
                table: "TourDays",
                column: "ClassificationId",
                principalTable: "TourClassifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
