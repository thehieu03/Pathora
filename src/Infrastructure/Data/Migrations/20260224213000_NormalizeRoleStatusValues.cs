using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Infrastructure.Data;

namespace Infrastructure.Data.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260224213000_NormalizeRoleStatusValues")]
public partial class NormalizeRoleStatusValues : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""
                             UPDATE "Roles"
                             SET "Status" = 1
                             WHERE "Status" NOT IN (1, 2);
                             """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
    }
}
