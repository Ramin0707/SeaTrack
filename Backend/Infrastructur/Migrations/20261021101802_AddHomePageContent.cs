using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class AddHomePageContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HomePageContents",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HeroLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroHighlightedTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HeroDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryButtonText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryButtonUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SecondaryButtonText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SecondaryButtonUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatOneValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatOneLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatTwoValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatTwoLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatThreeValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatThreeLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShipmentCardLabel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShipmentRouteTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShipmentVoyageText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShipmentOrigin = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShipmentDestination = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShipmentStatusText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomePageContents", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HomePageContents",
                schema: "identity");
        }
    }
}
