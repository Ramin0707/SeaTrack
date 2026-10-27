using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructur.Migrations
{
    /// <inheritdoc />
    public partial class AddAboutPageCms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AboutPageContents",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutPageContents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AboutPageSections",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AboutPageContentId = table.Column<int>(type: "int", nullable: false),
                    SectionType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ContentJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsVisible = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutPageSections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AboutPageSections_AboutPageContents_AboutPageContentId",
                        column: x => x.AboutPageContentId,
                        principalSchema: "identity",
                        principalTable: "AboutPageContents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AboutPageSections_AboutPageContentId_SortOrder",
                schema: "identity",
                table: "AboutPageSections",
                columns: new[] { "AboutPageContentId", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AboutPageSections",
                schema: "identity");

            migrationBuilder.DropTable(
                name: "AboutPageContents",
                schema: "identity");
        }
    }
}
