using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerOrderNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CustomerOrderNumber",
                schema: "shipping",
                table: "ShippingOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            // Assign customer-specific order numbers
            // Each customer gets their own sequence: 1, 2, 3...
            migrationBuilder.Sql(@"
                ;WITH NumberedOrders AS
                (
                    SELECT
                        Id,
                        ROW_NUMBER() OVER
                        (
                            PARTITION BY CustomerId
                            ORDER BY CreatedAtUtc, Id
                        ) AS CustomerOrderNumber
                    FROM [shipping].[ShippingOrders]
                )
                UPDATE ShippingOrders
                SET CustomerOrderNumber = NumberedOrders.CustomerOrderNumber
                FROM [shipping].[ShippingOrders] AS ShippingOrders
                INNER JOIN NumberedOrders
                    ON ShippingOrders.Id = NumberedOrders.Id;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerOrderNumber",
                schema: "shipping",
                table: "ShippingOrders");
        }
    }
}