using Domain.Enums;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Arrive.DTOs;

public class ArriveShipmentResponseDto
{
    public int ShipmentId { get; set; }

    public int ShippingOrderId { get; set; }

    public string TrackingNumber { get; set; } = string.Empty;

    public ShipmentStatus ShipmentStatus { get; set; }

    public ShippingOrderStatus ShippingOrderStatus { get; set; }

    public DateTime ArrivedAtUtc { get; set; }
}