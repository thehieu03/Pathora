using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.src.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddVisaPolicyEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "VisaPolicyId",
                table: "Tours",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "VisaPolicyId",
                table: "TourInstances",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VisaPolicies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Region = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProcessingDays = table.Column<int>(type: "integer", nullable: false),
                    BufferDays = table.Column<int>(type: "integer", nullable: false),
                    FullPaymentRequired = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisaPolicies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tours_VisaPolicyId",
                table: "Tours",
                column: "VisaPolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_TourInstances_VisaPolicyId",
                table: "TourInstances",
                column: "VisaPolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_VisaPolicies_IsActive",
                table: "VisaPolicies",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_VisaPolicies_IsDeleted",
                table: "VisaPolicies",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_VisaPolicies_Region",
                table: "VisaPolicies",
                column: "Region");

            migrationBuilder.AddForeignKey(
                name: "FK_TourInstances_VisaPolicies_VisaPolicyId",
                table: "TourInstances",
                column: "VisaPolicyId",
                principalTable: "VisaPolicies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_VisaPolicies_VisaPolicyId",
                table: "Tours",
                column: "VisaPolicyId",
                principalTable: "VisaPolicies",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourInstances_VisaPolicies_VisaPolicyId",
                table: "TourInstances");

            migrationBuilder.DropForeignKey(
                name: "FK_Tours_VisaPolicies_VisaPolicyId",
                table: "Tours");

            migrationBuilder.DropTable(
                name: "VisaPolicies");

            migrationBuilder.DropIndex(
                name: "IX_Tours_VisaPolicyId",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_TourInstances_VisaPolicyId",
                table: "TourInstances");

            migrationBuilder.DropColumn(
                name: "VisaPolicyId",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "VisaPolicyId",
                table: "TourInstances");
        }
    }
}
