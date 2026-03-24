using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTourResourceEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TourResources",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ContactPhone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ContactEmail = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    EntranceFee = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    Price = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    PricingType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    TransportationType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    TransportationName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    DurationMinutes = table.Column<int>(type: "integer", nullable: true),
                    RequiresIndividualTicket = table.Column<bool>(type: "boolean", nullable: false),
                    TicketInfo = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CheckInTime = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CheckOutTime = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Translations = table.Column<string>(type: "jsonb", nullable: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourResources", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourResources_Tours_TourId",
                        column: x => x.TourId,
                        principalTable: "Tours",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TourResources_TourId",
                table: "TourResources",
                column: "TourId");

            migrationBuilder.CreateIndex(
                name: "IX_TourResources_Type",
                table: "TourResources",
                column: "Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TourResources");
        }
    }
}
