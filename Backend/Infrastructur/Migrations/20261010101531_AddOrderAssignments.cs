using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderAssignments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ContainerId",
                schema: "shipping",
                table: "ShippingOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VoyageId",
                schema: "shipping",
                table: "ShippingOrders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShippingOrders_ContainerId",
                schema: "shipping",
                table: "ShippingOrders",
                column: "ContainerId");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingOrders_VoyageId",
                schema: "shipping",
                table: "ShippingOrders",
                column: "VoyageId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShippingOrders_Containers_ContainerId",
                schema: "shipping",
                table: "ShippingOrders",
                column: "ContainerId",
                principalSchema: "logistics",
                principalTable: "Containers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ShippingOrders_Voyages_VoyageId",
                schema: "shipping",
                table: "ShippingOrders",
                column: "VoyageId",
                principalSchema: "logistics",
                principalTable: "Voyages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShippingOrders_Containers_ContainerId",
                schema: "shipping",
                table: "ShippingOrders");

            migrationBuilder.DropForeignKey(
                name: "FK_ShippingOrders_Voyages_VoyageId",
                schema: "shipping",
                table: "ShippingOrders");

            migrationBuilder.DropIndex(
                name: "IX_ShippingOrders_ContainerId",
                schema: "shipping",
                table: "ShippingOrders");

            migrationBuilder.DropIndex(
                name: "IX_ShippingOrders_VoyageId",
                schema: "shipping",
                table: "ShippingOrders");

            migrationBuilder.DropColumn(
                name: "ContainerId",
                schema: "shipping",
                table: "ShippingOrders");

            migrationBuilder.DropColumn(
                name: "VoyageId",
                schema: "shipping",
                table: "ShippingOrders");
        }
    }
}
