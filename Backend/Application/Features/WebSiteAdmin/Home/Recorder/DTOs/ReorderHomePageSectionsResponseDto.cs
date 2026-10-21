namespace Application.Features.WebSiteAdmin.Home.Reorder.DTOs;

public class ReorderHomePageSectionsResponseDto
{
    public List<ReorderedHomePageSectionDto> Sections { get; set; }
        = new();
}

public class ReorderedHomePageSectionDto
{
    public int Id { get; set; }

    public string SectionType { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public bool IsVisible { get; set; }
}