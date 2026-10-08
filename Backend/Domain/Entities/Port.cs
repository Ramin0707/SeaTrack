namespace Domain.Entities;

public class Port : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public ICollection<Terminal> Terminals { get; set; }
        = new List<Terminal>();
}