namespace Domain.Entities;

public class AboutPageSection : BaseEntity
{
    public int AboutPageContentId { get; set; }

    public AboutPageContent AboutPageContent { get; set; } = null!;

    public string SectionType { get; set; } = string.Empty;

    public string ContentJson { get; set; } = "{}";

    public string? ImageUrl { get; set; }

    public int SortOrder { get; set; }

    public bool IsVisible { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }
}