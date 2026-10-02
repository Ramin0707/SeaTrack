using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class AddShippingOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "shipping");

            migrationBuilder.CreateTable(
                name: "ShippingOrders",
                schema: "shipping",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CargoType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Volume = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    OriginPort = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DestinationPort = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContainerType = table.Column<int>(type: "int", nullable: false),
                    DesiredShippingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingOrders", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShippingOrders",
                schema: "shipping");
        }
    }
}
