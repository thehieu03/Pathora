using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLegacyTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var legacyTables = new[]
            {
                "department", "file_metadata", "otp", "position",
                "refresh_token", "system_key", "users", "user_oauth",
                "logactivity", "logerror", "loghistory", "mail",
                "p_category", "p_function", "p_role", "p_role_function", "p_user_role"
            };

            foreach (var table in legacyTables)
            {
                migrationBuilder.Sql($"DROP TABLE IF EXISTS \"{table}\" CASCADE;");
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Legacy tables are not restored on rollback
        }
    }
}
