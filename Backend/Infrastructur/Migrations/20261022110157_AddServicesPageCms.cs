using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class AddServicesPageCms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ServicesPageContents",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    HeroLabel = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    HeroTitle = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    HeroHighlightedTitle = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    HeroDescription = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    HeroStatsJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CapabilitiesJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CapabilitiesTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ScrollText = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServicesPageContents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServicesPageItems",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Number = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Label = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    HighlightedTitle = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(3000)", maxLength: 3000, nullable: false),
                    ImageBadge = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ImageAlt = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BenefitsJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ButtonText = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ButtonUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsVisible = table.Column<bool>(type: "bit", nullable: false),
                    ServicesPageContentId = table.Column<int>(type: "int", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServicesPageItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServicesPageItems_ServicesPageContents_ServicesPageContentId",
                        column: x => x.ServicesPageContentId,
                        principalSchema: "identity",
                        principalTable: "ServicesPageContents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServicesPageItems_ServicesPageContentId_SortOrder",
                schema: "identity",
                table: "ServicesPageItems",
                columns: new[] { "ServicesPageContentId", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServicesPageItems",
                schema: "identity");

            migrationBuilder.DropTable(
                name: "ServicesPageContents",
                schema: "identity");
        }
    }
}
