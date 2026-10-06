using Domain.Enums;

namespace Application.Features.Shipping.Customer.Shipment.GetByShippingOrderId.DTOs;

public class GetShipmentResponseDto
{
    public int ShipmentId { get; set; }

    public int ShippingOrderId { get; set; }

    public string TrackingNumber { get; set; } = string.Empty;

    public ShipmentStatus Status { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? ShippedAtUtc { get; set; }

    public DateTime? DeliveredAtUtc { get; set; }
}