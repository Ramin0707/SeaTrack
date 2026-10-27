namespace Application.Features.WebSiteAdmin.About.Update.DTOs;

public class UpdateAboutPageSectionRequestDto
{
    public string SectionType { get; set; } = string.Empty;

    public bool IsVisible { get; set; }

    public string ContentJson { get; set; } = "{}";

    public string? ImageUrl { get; set; }
}