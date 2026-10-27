namespace Domain.Entities;

public class ServicesPageContent : BaseEntity
{
    public string Name { get; set; } = "Services Page";

    public string HeroLabel { get; set; } = "OUR SERVICES";

    public string HeroTitle { get; set; } = "Maritime logistics";

    public string HeroHighlightedTitle { get; set; }
        = "built for global trade.";

    public string HeroDescription { get; set; } = string.Empty;

    public string HeroStatsJson { get; set; } = "[]";

    public string CapabilitiesJson { get; set; } = "[]";

    public string CapabilitiesTitle { get; set; }
        = "OUR CAPABILITIES";

    public string ScrollText { get; set; }
        = "Explore Services";

    public ICollection<ServicesPageItem> Services { get; set; }
        = new List<ServicesPageItem>();

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }
}