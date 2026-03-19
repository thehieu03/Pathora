using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.src.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPricingAndCancellationPolicyToTour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CancellationPolicyId",
                table: "Tours",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PricingPolicyId",
                table: "Tours",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tours_CancellationPolicyId",
                table: "Tours",
                column: "CancellationPolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_Tours_PricingPolicyId",
                table: "Tours",
                column: "PricingPolicyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_CancellationPolicies_CancellationPolicyId",
                table: "Tours",
                column: "CancellationPolicyId",
                principalTable: "CancellationPolicies",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Tours_PricingPolicies_PricingPolicyId",
                table: "Tours",
                column: "PricingPolicyId",
                principalTable: "PricingPolicies",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tours_CancellationPolicies_CancellationPolicyId",
                table: "Tours");

            migrationBuilder.DropForeignKey(
                name: "FK_Tours_PricingPolicies_PricingPolicyId",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tours_CancellationPolicyId",
                table: "Tours");

            migrationBuilder.DropIndex(
                name: "IX_Tours_PricingPolicyId",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "CancellationPolicyId",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "PricingPolicyId",
                table: "Tours");
        }
    }
}
