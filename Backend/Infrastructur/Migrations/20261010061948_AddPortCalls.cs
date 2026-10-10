using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class AddPortCalls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PortCalls",
                schema: "logistics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VoyageId = table.Column<int>(type: "int", nullable: false),
                    PortId = table.Column<int>(type: "int", nullable: false),
                    TerminalId = table.Column<int>(type: "int", nullable: false),
                    BerthId = table.Column<int>(type: "int", nullable: false),
                    EstimatedArrivalUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EstimatedDepartureUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActualArrivalUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActualDepartureUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortCalls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PortCalls_Berths_BerthId",
                        column: x => x.BerthId,
                        principalSchema: "logistics",
                        principalTable: "Berths",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PortCalls_Ports_PortId",
                        column: x => x.PortId,
                        principalSchema: "logistics",
                        principalTable: "Ports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PortCalls_Terminals_TerminalId",
                        column: x => x.TerminalId,
                        principalSchema: "logistics",
                        principalTable: "Terminals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PortCalls_Voyages_VoyageId",
                        column: x => x.VoyageId,
                        principalSchema: "logistics",
                        principalTable: "Voyages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PortCalls_BerthId",
                schema: "logistics",
                table: "PortCalls",
                column: "BerthId");

            migrationBuilder.CreateIndex(
                name: "IX_PortCalls_PortId",
                schema: "logistics",
                table: "PortCalls",
                column: "PortId");

            migrationBuilder.CreateIndex(
                name: "IX_PortCalls_TerminalId",
                schema: "logistics",
                table: "PortCalls",
                column: "TerminalId");

            migrationBuilder.CreateIndex(
                name: "IX_PortCalls_VoyageId",
                schema: "logistics",
                table: "PortCalls",
                column: "VoyageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PortCalls",
                schema: "logistics");
        }
    }
}
