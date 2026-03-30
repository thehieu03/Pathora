using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPayOSOrderCodeToPaymentTransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PayOSOrderCode",
                table: "PaymentTransactions",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PaymentTransactions_PayOSOrderCode",
                table: "PaymentTransactions",
                column: "PayOSOrderCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PaymentTransactions_PayOSOrderCode",
                table: "PaymentTransactions");

            migrationBuilder.DropColumn(
                name: "PayOSOrderCode",
                table: "PaymentTransactions");
        }
    }
}
