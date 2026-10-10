using Domain.Enums;

namespace Domain.Entities;

public class ShippingOrder:BaseEntity
{
    
    public string CustomerId { get; set; } = string.Empty;

    public string CargoType { get; set; } = string.Empty;

    public decimal Weight { get; set; }

    public decimal Volume { get; set; }

    public string OriginPort { get; set; } = string.Empty;

    public string DestinationPort { get; set; } = string.Empty;

    public ContainerType ContainerType { get; set; }

    public DateTime DesiredShippingDate { get; set; }

    public ShippingOrderStatus Status { get; set; } = ShippingOrderStatus.AwaitingQuote;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public int? ContainerId { get; set; }
    public int? VoyageId { get; set; }

    public Container? Container { get; set; }
    public Voyage? Voyage { get; set; }
}