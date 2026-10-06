using Domain.Enums;

namespace Domain.Entities;

public class Shipment : BaseEntity
{
    public int ShippingOrderId { get; set; }

    public string TrackingNumber { get; set; } = string.Empty;

    public ShipmentStatus Status { get; set; } = ShipmentStatus.Preparing;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? ShippedAtUtc { get; set; }

    public DateTime? DeliveredAtUtc { get; set; }

    public ShippingOrder ShippingOrder { get; set; } = null!;
}