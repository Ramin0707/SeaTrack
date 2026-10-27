namespace Application.Features.WebSiteAdmin.About.Reorder.DTOs;

public class ReorderAboutPageSectionsRequestDto
{
    public List<ReorderAboutPageSectionItemDto> Items { get; set; }
        = new();
}

public class ReorderAboutPageSectionItemDto
{
    public int Id { get; set; }

    public int SortOrder { get; set; }
}