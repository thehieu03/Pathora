using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations;

#nullable restore

/// <inheritdoc />
public partial class AddUserSettingsEntity : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "UserSettings",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                UserId = table.Column<Guid>(type: "uuid", nullable: false),
                PreferredLanguage = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "vi"),
                NotificationEmail = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                NotificationSms = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                NotificationPush = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                Theme = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "light"),
                CreatedBy = table.Column<string>(type: "text", nullable: true),
                CreatedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                LastModifiedBy = table.Column<string>(type: "text", nullable: true),
                LastModifiedOnUtc = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserSettings", x => x.Id);
                table.ForeignKey(
                    name: "FK_UserSettings_Users_UserId",
                    column: x => x.UserId,
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_UserSettings_UserId",
            table: "UserSettings",
            column: "UserId",
            unique: true);

        // Seed default settings for all existing users
        migrationBuilder.Sql(
            @"INSERT INTO ""UserSettings"" (""Id"", ""UserId"", ""PreferredLanguage"", ""NotificationEmail"", ""NotificationSms"", ""NotificationPush"", ""Theme"", ""CreatedBy"", ""CreatedOnUtc"")
             SELECT
                 gen_random_uuid(),
                 u.""Id"",
                 'vi',
                 true,
                 true,
                 false,
                 'light',
                 'system',
                 NOW()
             FROM ""Users"" u
             WHERE NOT EXISTS (
                 SELECT 1 FROM ""UserSettings"" s WHERE s.""UserId"" = u.""Id""
             )");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("DELETE FROM \"UserSettings\" WHERE \"CreatedBy\" = 'system'");
        migrationBuilder.DropTable(name: "UserSettings");
    }
}
