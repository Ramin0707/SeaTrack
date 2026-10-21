namespace Application.Features.WebSiteAdmin.Home.Create.DTOs;

public class CreateHomePageSectionRequestDto
{
    public string SectionType { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public bool IsVisible { get; set; } = true;

    public string ContentJson { get; set; } = "{}";

    public string? ImageUrl { get; set; }
}