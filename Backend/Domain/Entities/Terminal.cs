namespace Domain.Entities;

public class Terminal : BaseEntity
{
    public int PortId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public Port Port { get; set; } = null!;

    public ICollection<Berth> Berths { get; set; }
        = new List<Berth>();
}