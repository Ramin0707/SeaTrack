namespace Application.Features.WebSiteAdmin.Home.Get.DTOs;

public class GetHomePageResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }

    public List<HomePageSectionDto> Sections { get; set; } = new();
}

public class HomePageSectionDto
{
    public int Id { get; set; }

    public string SectionType { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public bool IsVisible { get; set; }

    public string ContentJson { get; set; } = "{}";

    public string? ImageUrl { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }
}