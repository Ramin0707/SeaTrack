namespace Application.Features.WebSiteAdmin.About.Create.DTOs;

public class CreateAboutPageSectionRequestDto
{
    public string SectionType { get; set; } = string.Empty;

    public bool IsVisible { get; set; } = true;

    public string ContentJson { get; set; } = "{}";

    public string? ImageUrl { get; set; }
}