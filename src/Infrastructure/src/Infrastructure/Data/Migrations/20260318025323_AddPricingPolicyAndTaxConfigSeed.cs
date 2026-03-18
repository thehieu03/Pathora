using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.src.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPricingPolicyAndTaxConfigSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SiteContents_PageKey",
                table: "SiteContents");

            migrationBuilder.DropIndex(
                name: "IX_SiteContents_PageKey_ContentKey",
                table: "SiteContents");

            migrationBuilder.AlterColumn<string>(
                name: "PageKey",
                table: "SiteContents",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "LastModifiedBy",
                table: "SiteContents",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "SiteContents",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "ContentKey",
                table: "SiteContents",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateTable(
                name: "CancellationPolicies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PolicyCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TourScope = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MinDaysBeforeDeparture = table.Column<int>(type: "integer", nullable: false),
                    MaxDaysBeforeDeparture = table.Column<int>(type: "integer", nullable: false),
                    PenaltyPercentage = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    ApplyOn = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "FullAmount"),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Active"),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CancellationPolicies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TaxConfigs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TaxName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TaxRate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    EffectiveDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaxConfigs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TourRequests_Status_DepartureDate",
                table: "TourRequests",
                columns: new[] { "Status", "DepartureDate" });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentTransactions_PaidAt",
                table: "PaymentTransactions",
                column: "PaidAt");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentTransactions_Status",
                table: "PaymentTransactions",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentTransactions_Status_PaidAt",
                table: "PaymentTransactions",
                columns: new[] { "Status", "PaidAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_Status_TourInstanceId",
                table: "Bookings",
                columns: new[] { "Status", "TourInstanceId" });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_Status_UserId",
                table: "Bookings",
                columns: new[] { "Status", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId_TourInstanceId",
                table: "Bookings",
                columns: new[] { "UserId", "TourInstanceId" });

            migrationBuilder.CreateIndex(
                name: "IX_CancellationPolicies_CreatedOnUtc",
                table: "CancellationPolicies",
                column: "CreatedOnUtc");

            migrationBuilder.CreateIndex(
                name: "IX_CancellationPolicies_PolicyCode",
                table: "CancellationPolicies",
                column: "PolicyCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CancellationPolicies_Status_IsDeleted",
                table: "CancellationPolicies",
                columns: new[] { "Status", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_CancellationPolicies_TourScope_MinDaysBeforeDeparture_MaxDa~",
                table: "CancellationPolicies",
                columns: new[] { "TourScope", "MinDaysBeforeDeparture", "MaxDaysBeforeDeparture", "Status", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_TaxConfigs_EffectiveDate",
                table: "TaxConfigs",
                column: "EffectiveDate");

            migrationBuilder.CreateIndex(
                name: "IX_TaxConfigs_IsActive",
                table: "TaxConfigs",
                column: "IsActive");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CancellationPolicies");

            migrationBuilder.DropTable(
                name: "TaxConfigs");

            migrationBuilder.DropIndex(
                name: "IX_TourRequests_Status_DepartureDate",
                table: "TourRequests");

            migrationBuilder.DropIndex(
                name: "IX_PaymentTransactions_PaidAt",
                table: "PaymentTransactions");

            migrationBuilder.DropIndex(
                name: "IX_PaymentTransactions_Status",
                table: "PaymentTransactions");

            migrationBuilder.DropIndex(
                name: "IX_PaymentTransactions_Status_PaidAt",
                table: "PaymentTransactions");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_Status_TourInstanceId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_Status_UserId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_UserId_TourInstanceId",
                table: "Bookings");

            migrationBuilder.AlterColumn<string>(
                name: "PageKey",
                table: "SiteContents",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "LastModifiedBy",
                table: "SiteContents",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "SiteContents",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ContentKey",
                table: "SiteContents",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_SiteContents_PageKey",
                table: "SiteContents",
                column: "PageKey");

            migrationBuilder.CreateIndex(
                name: "IX_SiteContents_PageKey_ContentKey",
                table: "SiteContents",
                columns: new[] { "PageKey", "ContentKey" },
                unique: true);
        }
    }
}
