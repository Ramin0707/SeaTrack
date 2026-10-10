namespace Domain.Entities;

public class Route : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public int OriginPortId { get; set; }

    public int DestinationPortId { get; set; }

    public decimal DistanceNauticalMiles { get; set; }

    public int EstimatedTransitDays { get; set; }

    public bool IsActive { get; set; } = true;

    public Port OriginPort { get; set; } = null!;

    public Port DestinationPort { get; set; } = null!;
}