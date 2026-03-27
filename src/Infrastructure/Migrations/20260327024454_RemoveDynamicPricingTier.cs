using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDynamicPricingTier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TourInstancePricingTiers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TourInstancePricingTiers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TourClassificationId = table.Column<Guid>(type: "uuid", nullable: true),
                    TourInstanceId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    MaxParticipants = table.Column<int>(type: "integer", nullable: false),
                    MinParticipants = table.Column<int>(type: "integer", nullable: false),
                    PricePerPerson = table.Column<decimal>(type: "numeric(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourInstancePricingTiers", x => x.Id);
                    table.CheckConstraint("CK_TourInstancePricingTiers_ExactlyOneOwner", "((\"TourInstanceId\" IS NOT NULL AND \"TourClassificationId\" IS NULL) OR (\"TourInstanceId\" IS NULL AND \"TourClassificationId\" IS NOT NULL))");
                    table.CheckConstraint("CK_TourInstancePricingTiers_ValidRange", "(\"MinParticipants\" >= 1 AND \"MaxParticipants\" >= \"MinParticipants\")");
                    table.ForeignKey(
                        name: "FK_TourInstancePricingTiers_TourClassifications_TourClassifica~",
                        column: x => x.TourClassificationId,
                        principalTable: "TourClassifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TourInstancePricingTiers_TourInstances_TourInstanceId",
                        column: x => x.TourInstanceId,
                        principalTable: "TourInstances",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TourInstancePricingTiers_TourClassificationId_MinParticipan~",
                table: "TourInstancePricingTiers",
                columns: new[] { "TourClassificationId", "MinParticipants", "MaxParticipants" },
                filter: "\"TourClassificationId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_TourInstancePricingTiers_TourInstanceId_MinParticipants_Max~",
                table: "TourInstancePricingTiers",
                columns: new[] { "TourInstanceId", "MinParticipants", "MaxParticipants" },
                filter: "\"TourInstanceId\" IS NOT NULL");
        }
    }
}
