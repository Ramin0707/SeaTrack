namespace Application.Features.WebSiteAdmin.Home.Update.DTOs;

public class UpdateHomePageSectionRequestDto
{
    public string SectionType { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public bool IsVisible { get; set; }

    public string ContentJson { get; set; } = "{}";

    public string? ImageUrl { get; set; }
}