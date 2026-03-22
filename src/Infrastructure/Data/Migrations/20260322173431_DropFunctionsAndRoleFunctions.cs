using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.src.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class DropFunctionsAndRoleFunctions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoleFunctions");

            migrationBuilder.DropTable(
                name: "Functions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Functions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ApiUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ButtonShow = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true),
                    LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Functions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoleFunctions",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    FunctionId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleFunctions", x => new { x.RoleId, x.FunctionId });
                    table.ForeignKey(
                        name: "FK_RoleFunctions_Functions_FunctionId",
                        column: x => x.FunctionId,
                        principalTable: "Functions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoleFunctions_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Functions_CategoryId_IsDeleted",
                table: "Functions",
                columns: new[] { "CategoryId", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_RoleFunctions_FunctionId",
                table: "RoleFunctions",
                column: "FunctionId");
        }
    }
}
