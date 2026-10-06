using Domain.Enums;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Deliver.DTOs;

public class DeliverShipmentResponseDto
{
    public int ShipmentId { get; set; }

    public int ShippingOrderId { get; set; }

    public string TrackingNumber { get; set; } = string.Empty;

    public ShipmentStatus ShipmentStatus { get; set; }

    public ShippingOrderStatus ShippingOrderStatus { get; set; }

    public DateTime? DeliveredAtUtc { get; set; }
}