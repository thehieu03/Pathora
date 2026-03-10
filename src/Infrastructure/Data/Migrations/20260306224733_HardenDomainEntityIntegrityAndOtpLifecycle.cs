using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class HardenDomainEntityIntegrityAndOtpLifecycle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Otps",
                table: "Otps");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "Otps",
                type: "uuid",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE "Otps"
                SET "Id" = md5("Email" || ':' || "Code")::uuid
                WHERE "Id" IS NULL;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Otps",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Otps",
                table: "Otps",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Otps_Email",
                table: "Otps",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Otps",
                table: "Otps");

            migrationBuilder.DropIndex(
                name: "IX_Otps_Email",
                table: "Otps");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Otps");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Users",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Otps",
                table: "Otps",
                columns: new[] { "Email", "Code" });
        }
    }
}
