using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class RefactorHomePageCmsSections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HeroDescription",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "HeroHighlightedTitle",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "HeroLabel",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "HeroTitle",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "PrimaryButtonText",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "PrimaryButtonUrl",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "SecondaryButtonText",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "SecondaryButtonUrl",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "ShipmentCardLabel",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "ShipmentDestination",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "ShipmentOrigin",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "ShipmentRouteTitle",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "ShipmentStatusText",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "ShipmentVoyageText",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "StatOneLabel",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "StatOneValue",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "StatThreeLabel",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "StatThreeValue",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "StatTwoLabel",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.DropColumn(
                name: "StatTwoValue",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "HomePageSections",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SectionType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsVisible = table.Column<bool>(type: "bit", nullable: false),
                    ContentJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    HomePageContentId = table.Column<int>(type: "int", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomePageSections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HomePageSections_HomePageContents_HomePageContentId",
                        column: x => x.HomePageContentId,
                        principalSchema: "identity",
                        principalTable: "HomePageContents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HomePageSections_HomePageContentId_SortOrder",
                schema: "identity",
                table: "HomePageSections",
                columns: new[] { "HomePageContentId", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HomePageSections",
                schema: "identity");

            migrationBuilder.DropColumn(
                name: "Name",
                schema: "identity",
                table: "HomePageContents");

            migrationBuilder.AddColumn<string>(
                name: "HeroDescription",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroHighlightedTitle",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroLabel",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HeroTitle",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PrimaryButtonText",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PrimaryButtonUrl",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SecondaryButtonText",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SecondaryButtonUrl",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShipmentCardLabel",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShipmentDestination",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShipmentOrigin",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShipmentRouteTitle",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShipmentStatusText",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShipmentVoyageText",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StatOneLabel",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StatOneValue",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StatThreeLabel",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StatThreeValue",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StatTwoLabel",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StatTwoValue",
                schema: "identity",
                table: "HomePageContents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
