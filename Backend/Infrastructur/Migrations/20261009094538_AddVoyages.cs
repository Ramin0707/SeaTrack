using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class AddVoyages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Voyages",
                schema: "logistics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VoyageNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    VesselId = table.Column<int>(type: "int", nullable: false),
                    RouteId = table.Column<int>(type: "int", nullable: false),
                    EstimatedDepartureUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EstimatedArrivalUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActualDepartureUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActualArrivalUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Voyages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Voyages_Routes_RouteId",
                        column: x => x.RouteId,
                        principalSchema: "logistics",
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Voyages_Vessels_VesselId",
                        column: x => x.VesselId,
                        principalSchema: "logistics",
                        principalTable: "Vessels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Voyages_RouteId",
                schema: "logistics",
                table: "Voyages",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_Voyages_VesselId",
                schema: "logistics",
                table: "Voyages",
                column: "VesselId");

            migrationBuilder.CreateIndex(
                name: "IX_Voyages_VoyageNumber",
                schema: "logistics",
                table: "Voyages",
                column: "VoyageNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Voyages",
                schema: "logistics");
        }
    }
}
