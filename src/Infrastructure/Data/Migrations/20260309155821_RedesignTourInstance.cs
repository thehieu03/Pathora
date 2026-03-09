using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RedesignTourInstance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "TourInstances");

            migrationBuilder.RenameColumn(
                name: "SalePrice",
                table: "TourInstances",
                newName: "SellingPrice");

            migrationBuilder.RenameColumn(
                name: "RegisteredParticipants",
                table: "TourInstances",
                newName: "CurrentParticipation");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "TourInstances",
                newName: "OperatingCost");

            migrationBuilder.RenameColumn(
                name: "MinParticipants",
                table: "TourInstances",
                newName: "MinParticipation");

            migrationBuilder.RenameColumn(
                name: "MaxParticipants",
                table: "TourInstances",
                newName: "MaxParticipation");

            migrationBuilder.AddColumn<string>(
                name: "CustomerSegment",
                table: "Tours",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TourScope",
                table: "Tours",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "BasePrice",
                table: "TourInstances",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "CancellationReason",
                table: "TourInstances",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "TourInstances",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TourInstanceCode",
                table: "TourInstances",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "TourInstanceImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    FileId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    OriginalFileName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    FileName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    PublicURL = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    TourInstanceId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourInstanceImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TourInstanceImages_TourInstances_TourInstanceId",
                        column: x => x.TourInstanceId,
                        principalTable: "TourInstances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TourInstances_TourInstanceCode",
                table: "TourInstances",
                column: "TourInstanceCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TourInstanceImages_TourInstanceId",
                table: "TourInstanceImages",
                column: "TourInstanceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TourInstanceImages");

            migrationBuilder.DropIndex(
                name: "IX_TourInstances_TourInstanceCode",
                table: "TourInstances");

            migrationBuilder.DropColumn(
                name: "CustomerSegment",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "TourScope",
                table: "Tours");

            migrationBuilder.DropColumn(
                name: "BasePrice",
                table: "TourInstances");

            migrationBuilder.DropColumn(
                name: "CancellationReason",
                table: "TourInstances");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "TourInstances");

            migrationBuilder.DropColumn(
                name: "TourInstanceCode",
                table: "TourInstances");

            migrationBuilder.RenameColumn(
                name: "SellingPrice",
                table: "TourInstances",
                newName: "SalePrice");

            migrationBuilder.RenameColumn(
                name: "OperatingCost",
                table: "TourInstances",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "MinParticipation",
                table: "TourInstances",
                newName: "MinParticipants");

            migrationBuilder.RenameColumn(
                name: "MaxParticipation",
                table: "TourInstances",
                newName: "MaxParticipants");

            migrationBuilder.RenameColumn(
                name: "CurrentParticipation",
                table: "TourInstances",
                newName: "RegisteredParticipants");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "TourInstances",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }
    }
}
