using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.src.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDepositPolicyEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DepositPolicyId",
                table: "Tours",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DepositPolicyId",
                table: "TourInstances",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DepositPolicies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourScope = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DepositType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DepositValue = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    MinDaysBeforeDeparture = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepositPolicies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tours_DepositPolicyId",
                table: "Tours",
                column: "DepositPolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_TourInstances_DepositPolicyId",
                table: "TourInstances",
                column: "DepositPolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_DepositPolicies_IsActive",
                table: "DepositPolicies",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_DepositPolicies_IsDeleted",
                table: "DepositPolicies",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_DepositPolicies_TourScope",
                table: "DepositPolicies",
                column: "TourScope");

            migrationBuilder.AddForeignKey(
                name: "FK_TourInstances_DepositPolicies_DepositPolicyId",
                table: "TourInstances",
                column: "DepositPolicyId",
                principalTable: "DepositPolicies",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_DepositPolicies_DepositPolicyId",
                table: "Tours",
                column: "DepositPolicyId",
                principalTable: "DepositPolicies",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TourInstances_DepositPolicies_DepositPolicyId",
                table: "TourInstances");

            migrationBuilder.DropForeignKey(
                name: "FK_Tours_DepositPolicies_DepositPolicyId",
                table: "Tours");

            migrationBuilder.DropTable(
                name: "DepositPolicies");

            migrationBuilder.DropIndex(
                name: "IX_Tours_DepositPolicyId",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_TourInstances_DepositPolicyId",
                table: "TourInstances");

            migrationBuilder.DropColumn(
                name: "DepositPolicyId",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "DepositPolicyId",
                table: "TourInstances");
        }
    }
}
