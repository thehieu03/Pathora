using System.Collections.Generic;
using Domain.Entities.Translations;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.src.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTranslationsToPolicies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add nullable columns first (since existing data has no translations)
            migrationBuilder.AddColumn<Dictionary<string, VisaPolicyTranslationData>>(
                name: "Translations",
                table: "VisaPolicies",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<Dictionary<string, PricingPolicyTranslationData>>(
                name: "Translations",
                table: "PricingPolicies",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<Dictionary<string, DepositPolicyTranslationData>>(
                name: "Translations",
                table: "DepositPolicies",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<Dictionary<string, CancellationPolicyTranslationData>>(
                name: "Translations",
                table: "CancellationPolicies",
                type: "jsonb",
                nullable: true);

            // Set default empty JSON objects
            migrationBuilder.Sql("UPDATE \"VisaPolicies\" SET \"Translations\" = '{}'::jsonb WHERE \"Translations\" IS NULL");
            migrationBuilder.Sql("UPDATE \"PricingPolicies\" SET \"Translations\" = '{}'::jsonb WHERE \"Translations\" IS NULL");
            migrationBuilder.Sql("UPDATE \"DepositPolicies\" SET \"Translations\" = '{}'::jsonb WHERE \"Translations\" IS NULL");
            migrationBuilder.Sql("UPDATE \"CancellationPolicies\" SET \"Translations\" = '{}'::jsonb WHERE \"Translations\" IS NULL");

            // Alter to NOT NULL
            migrationBuilder.AlterColumn<Dictionary<string, VisaPolicyTranslationData>>(
                name: "Translations",
                table: "VisaPolicies",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AlterColumn<Dictionary<string, PricingPolicyTranslationData>>(
                name: "Translations",
                table: "PricingPolicies",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AlterColumn<Dictionary<string, DepositPolicyTranslationData>>(
                name: "Translations",
                table: "DepositPolicies",
                type: "jsonb",
                nullable: false);

            migrationBuilder.AlterColumn<Dictionary<string, CancellationPolicyTranslationData>>(
                name: "Translations",
                table: "CancellationPolicies",
                type: "jsonb",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Translations",
                table: "VisaPolicies");

            migrationBuilder.DropColumn(
                name: "Translations",
                table: "PricingPolicies");

            migrationBuilder.DropColumn(
                name: "Translations",
                table: "DepositPolicies");

            migrationBuilder.DropColumn(
                name: "Translations",
                table: "CancellationPolicies");
        }
    }
}
