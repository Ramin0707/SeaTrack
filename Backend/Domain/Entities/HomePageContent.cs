namespace Domain.Entities;

public class HomePageContent : BaseEntity
{
    public string Name { get; set; } = "Home Page";

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }

    public ICollection<HomePageSection> Sections { get; set; }
        = new List<HomePageSection>();
}