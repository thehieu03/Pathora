using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddComprehensiveIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Users_CreatedOnUtc",
                table: "Users",
                column: "CreatedOnUtc");

            migrationBuilder.CreateIndex(
                name: "IX_Users_IsDeleted",
                table: "Users",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_SystemKeys_CodeKey",
                table: "SystemKeys",
                column: "CodeKey");

            migrationBuilder.CreateIndex(
                name: "IX_SystemKeys_ParentId_IsDeleted",
                table: "SystemKeys",
                columns: new[] { "ParentId", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Status_IsDeleted",
                table: "Roles",
                columns: new[] { "Status", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_ExpiresOnUtc",
                table: "RefreshTokens",
                column: "ExpiresOnUtc");

            migrationBuilder.CreateIndex(
                name: "IX_Positions_IsDeleted",
                table: "Positions",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Otps_ExpiryDate",
                table: "Otps",
                column: "ExpiryDate");

            migrationBuilder.CreateIndex(
                name: "IX_Mails_CreatedAt",
                table: "Mails",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Mails_Status",
                table: "Mails",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_LogErrors_CreatedOnUtc",
                table: "LogErrors",
                column: "CreatedOnUtc");

            migrationBuilder.CreateIndex(
                name: "IX_Functions_CategoryId_IsDeleted",
                table: "Functions",
                columns: new[] { "CategoryId", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_FileMetadatas_IsDeleted",
                table: "FileMetadatas",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_FileMetadatas_LinkedEntityId",
                table: "FileMetadatas",
                column: "LinkedEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_Departments_IsDeleted",
                table: "Departments",
                column: "IsDeleted");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_CreatedOnUtc",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_IsDeleted",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Username",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_SystemKeys_CodeKey",
                table: "SystemKeys");

            migrationBuilder.DropIndex(
                name: "IX_SystemKeys_ParentId_IsDeleted",
                table: "SystemKeys");

            migrationBuilder.DropIndex(
                name: "IX_Roles_Status_IsDeleted",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_RefreshTokens_ExpiresOnUtc",
                table: "RefreshTokens");

            migrationBuilder.DropIndex(
                name: "IX_Positions_IsDeleted",
                table: "Positions");

            migrationBuilder.DropIndex(
                name: "IX_Otps_ExpiryDate",
                table: "Otps");

            migrationBuilder.DropIndex(
                name: "IX_Mails_CreatedAt",
                table: "Mails");

            migrationBuilder.DropIndex(
                name: "IX_Mails_Status",
                table: "Mails");

            migrationBuilder.DropIndex(
                name: "IX_LogErrors_CreatedOnUtc",
                table: "LogErrors");

            migrationBuilder.DropIndex(
                name: "IX_Functions_CategoryId_IsDeleted",
                table: "Functions");

            migrationBuilder.DropIndex(
                name: "IX_FileMetadatas_IsDeleted",
                table: "FileMetadatas");

            migrationBuilder.DropIndex(
                name: "IX_FileMetadatas_LinkedEntityId",
                table: "FileMetadatas");

            migrationBuilder.DropIndex(
                name: "IX_Departments_IsDeleted",
                table: "Departments");
        }
    }
}
