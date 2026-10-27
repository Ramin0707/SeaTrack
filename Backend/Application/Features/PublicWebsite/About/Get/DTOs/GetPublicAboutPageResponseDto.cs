namespace Application.Features.PublicWebsite.About.Get.DTOs;

public class GetPublicAboutPageResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public List<PublicAboutPageSectionDto> Sections { get; set; }
        = new();
}

public class PublicAboutPageSectionDto
{
    public int Id { get; set; }

    public string SectionType { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public string ContentJson { get; set; } = "{}";

    public string? ImageUrl { get; set; }
}