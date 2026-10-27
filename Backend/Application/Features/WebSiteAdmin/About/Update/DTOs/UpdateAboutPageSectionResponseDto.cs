namespace Application.Features.WebSiteAdmin.About.Update.DTOs;

public class UpdateAboutPageSectionResponseDto
{
    public int Id { get; set; }

    public string SectionType { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public bool IsVisible { get; set; }

    public string ContentJson { get; set; } = "{}";

    public string? ImageUrl { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }
}