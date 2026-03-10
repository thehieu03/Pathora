using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTourInstance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Username",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "TourInstances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassificationId = table.Column<Guid>(type: "uuid", nullable: false),
                    TourName = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    TourCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ClassificationName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Location = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Thumbnail_FileId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Thumbnail_OriginalFileName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Thumbnail_FileName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Thumbnail_PublicURL = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    InstanceType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    StartDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    DurationDays = table.Column<int>(type: "integer", nullable: false),
                    MinParticipants = table.Column<int>(type: "integer", nullable: false),
                    MaxParticipants = table.Column<int>(type: "integer", nullable: false),
                    RegisteredParticipants = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    Price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    SalePrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Category = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ConfirmationDeadline = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    IncludedServices = table.Column<string>(type: "jsonb", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true),
                    Guide = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourInstances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourInstances_TourClassifications_ClassificationId",
                        column: x => x.ClassificationId,
                        principalTable: "TourClassifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TourInstances_Tours_TourId",
                        column: x => x.TourId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TourInstancePricingTiers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourInstanceId = table.Column<Guid>(type: "uuid", nullable: false),
                    MinParticipants = table.Column<int>(type: "integer", nullable: false),
                    MaxParticipants = table.Column<int>(type: "integer", nullable: false),
                    PricePerPerson = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourInstancePricingTiers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourInstancePricingTiers_TourInstances_TourInstanceId",
                        column: x => x.TourInstanceId,
                        principalTable: "TourInstances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tours_IsDeleted",
                table: "Tours",
                column: "IsDeleted",
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_TourInstancePricingTiers_TourInstanceId",
                table: "TourInstancePricingTiers",
                column: "TourInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_TourInstances_ClassificationId",
                table: "TourInstances",
                column: "ClassificationId");

            migrationBuilder.CreateIndex(
                name: "IX_TourInstances_IsDeleted",
                table: "TourInstances",
                column: "IsDeleted",
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_TourInstances_StartDate",
                table: "TourInstances",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_TourInstances_Status_InstanceType",
                table: "TourInstances",
                columns: new[] { "Status", "InstanceType" });

            migrationBuilder.CreateIndex(
                name: "IX_TourInstances_TourId",
                table: "TourInstances",
                column: "TourId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TourInstancePricingTiers");

            migrationBuilder.DropTable(
                name: "TourInstances");

            migrationBuilder.DropIndex(
                name: "IX_Users_Username",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Tours_IsDeleted",
                table: "Tours");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username");
        }
    }
}
