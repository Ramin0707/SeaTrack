namespace Application.Features.WebSiteAdmin.Services.Update.DTOs;

public class UpdateServicesPageRequestDto
{
    public string Name { get; set; } = string.Empty;

    public string HeroLabel { get; set; } = string.Empty;

    public string HeroTitle { get; set; } = string.Empty;

    public string HeroHighlightedTitle { get; set; } = string.Empty;

    public string HeroDescription { get; set; } = string.Empty;

    public List<ServicesPageStatDto> HeroStats { get; set; } = new();

    public string CapabilitiesTitle { get; set; } = string.Empty;

    public List<ServicesPageCapabilityDto> Capabilities { get; set; } = new();

    public string ScrollText { get; set; } = string.Empty;
}


public class ServicesPageStatDto
{
    public string Value { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;
}


public class ServicesPageCapabilityDto
{
    public string Number { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;
}