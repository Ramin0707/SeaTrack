namespace Domain.Entities;

public class AboutPageContent : BaseEntity
{
    public string Name { get; set; } = "About Page";

    public ICollection<AboutPageSection> Sections { get; set; }
        = new List<AboutPageSection>();

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }
}