using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingTransportAndAccommodationDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BookingAccommodationDetails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingActivityReservationId = table.Column<Guid>(type: "uuid", nullable: false),
                    SupplierId = table.Column<Guid>(type: "uuid", nullable: true),
                    AccommodationName = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    RoomType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BedType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ContactPhone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CheckInAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CheckOutAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    BuyPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    TaxRate = table.Column<decimal>(type: "numeric(5,2)", nullable: false, defaultValue: 0m),
                    TotalBuyPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    IsTaxable = table.Column<bool>(type: "boolean", nullable: false),
                    ConfirmationCode = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    FileUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    SpecialRequest = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingAccommodationDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookingAccommodationDetails_BookingActivityReservations_Boo~",
                        column: x => x.BookingActivityReservationId,
                        principalTable: "BookingActivityReservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingAccommodationDetails_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "BookingTransportDetails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingActivityReservationId = table.Column<Guid>(type: "uuid", nullable: false),
                    SupplierId = table.Column<Guid>(type: "uuid", nullable: true),
                    TransportType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DepartureAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    ArrivalAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    TicketNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ETicketNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SeatNumber = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    SeatClass = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    VehicleNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    BuyPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    TaxRate = table.Column<decimal>(type: "numeric(5,2)", nullable: false, defaultValue: 0m),
                    TotalBuyPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    IsTaxable = table.Column<bool>(type: "boolean", nullable: false),
                    FileUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    SpecialRequest = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingTransportDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookingTransportDetails_BookingActivityReservations_Booking~",
                        column: x => x.BookingActivityReservationId,
                        principalTable: "BookingActivityReservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingTransportDetails_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookingAccommodationDetails_BookingActivityReservationId",
                table: "BookingAccommodationDetails",
                column: "BookingActivityReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingAccommodationDetails_Status",
                table: "BookingAccommodationDetails",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_BookingAccommodationDetails_SupplierId",
                table: "BookingAccommodationDetails",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingTransportDetails_BookingActivityReservationId",
                table: "BookingTransportDetails",
                column: "BookingActivityReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingTransportDetails_Status",
                table: "BookingTransportDetails",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_BookingTransportDetails_SupplierId",
                table: "BookingTransportDetails",
                column: "SupplierId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookingAccommodationDetails");

            migrationBuilder.DropTable(
                name: "BookingTransportDetails");
        }
    }
}
