namespace Application.Features.PublicWebsite.Home.Get.DTOs;

public class GetPublicHomePageResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public List<PublicHomePageSectionDto> Sections { get; set; }
        = new();
}

public class PublicHomePageSectionDto
{
    public int Id { get; set; }

    public string SectionType { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public string ContentJson { get; set; } = "{}";

    public string? ImageUrl { get; set; }
}