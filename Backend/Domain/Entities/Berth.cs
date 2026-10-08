namespace Domain.Entities;

public class Berth : BaseEntity
{
    public int TerminalId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public decimal? MaxDepth { get; set; }

    public decimal? MaxVesselLength { get; set; }

    public bool IsActive { get; set; } = true;

    public Terminal Terminal { get; set; } = null!;
}