namespace Application.Features.WebSiteAdmin.About.Get.DTOs;

public class GetAboutPageResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }

    public List<AboutPageSectionDto> Sections { get; set; } = new();
}

public class AboutPageSectionDto
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