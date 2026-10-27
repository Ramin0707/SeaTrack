using System.Text.Json;

namespace Application.Features.PublicWebsite.Services.Get.DTOs;

public class GetPublicServicesPageResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string HeroLabel { get; set; } = string.Empty;

    public string HeroTitle { get; set; } = string.Empty;

    public string HeroHighlightedTitle { get; set; } = string.Empty;

    public string HeroDescription { get; set; } = string.Empty;

    public JsonElement HeroStats { get; set; }

    public string CapabilitiesTitle { get; set; } = string.Empty;

    public JsonElement Capabilities { get; set; }

    public string ScrollText { get; set; } = string.Empty;

    public List<PublicServiceItemDto> Services { get; set; } = new();
}


public class PublicServiceItemDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Number { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string HighlightedTitle { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImageBadge { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public string? ImageAlt { get; set; }

    public JsonElement Benefits { get; set; }

    public string ButtonText { get; set; } = string.Empty;

    public string ButtonUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}