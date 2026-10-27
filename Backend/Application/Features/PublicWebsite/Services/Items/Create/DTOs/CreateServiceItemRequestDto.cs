namespace Application.Features.WebSiteAdmin.Services.Items.Create.DTOs;

public class CreateServiceItemRequestDto
{
    public string Name { get; set; } = string.Empty;

    public string Number { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string HighlightedTitle { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImageBadge { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public string? ImageAlt { get; set; }

    public List<CreateServiceBenefitDto> Benefits { get; set; } = new();

    public string ButtonText { get; set; } = string.Empty;

    public string ButtonUrl { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public bool IsVisible { get; set; } = true;
}

public class CreateServiceBenefitDto
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}