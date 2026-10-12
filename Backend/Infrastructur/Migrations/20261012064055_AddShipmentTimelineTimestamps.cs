using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class AddShipmentTimelineTimestamps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ArrivedAtUtc",
                schema: "identity",
                table: "Shipments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LoadedAtUtc",
                schema: "identity",
                table: "Shipments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UnloadedAtUtc",
                schema: "identity",
                table: "Shipments",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArrivedAtUtc",
                schema: "identity",
                table: "Shipments");

            migrationBuilder.DropColumn(
                name: "LoadedAtUtc",
                schema: "identity",
                table: "Shipments");

            migrationBuilder.DropColumn(
                name: "UnloadedAtUtc",
                schema: "identity",
                table: "Shipments");
        }
    }
}
