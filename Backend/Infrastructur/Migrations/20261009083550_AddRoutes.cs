using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class AddRoutes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Routes",
                schema: "logistics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    OriginPortId = table.Column<int>(type: "int", nullable: false),
                    DestinationPortId = table.Column<int>(type: "int", nullable: false),
                    DistanceNauticalMiles = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    EstimatedTransitDays = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Routes_Ports_DestinationPortId",
                        column: x => x.DestinationPortId,
                        principalSchema: "logistics",
                        principalTable: "Ports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Routes_Ports_OriginPortId",
                        column: x => x.OriginPortId,
                        principalSchema: "logistics",
                        principalTable: "Ports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Routes_Code",
                schema: "logistics",
                table: "Routes",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Routes_DestinationPortId",
                schema: "logistics",
                table: "Routes",
                column: "DestinationPortId");

            migrationBuilder.CreateIndex(
                name: "IX_Routes_OriginPortId",
                schema: "logistics",
                table: "Routes",
                column: "OriginPortId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Routes",
                schema: "logistics");
        }
    }
}
