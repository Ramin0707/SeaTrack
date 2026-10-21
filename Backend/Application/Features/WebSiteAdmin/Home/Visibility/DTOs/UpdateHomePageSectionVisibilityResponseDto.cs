namespace Application.Features.WebSiteAdmin.Home.Visibility.DTOs;

public class UpdateHomePageSectionVisibilityResponseDto
{
    public int Id { get; set; }

    public string SectionType { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public bool IsVisible { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }
}