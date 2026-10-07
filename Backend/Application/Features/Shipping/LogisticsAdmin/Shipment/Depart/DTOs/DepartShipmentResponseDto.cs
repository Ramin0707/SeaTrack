using Domain.Enums;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Depart.DTOs;

public class DepartShipmentResponseDto
{
    public int ShipmentId { get; set; }

    public int ShippingOrderId { get; set; }

    public string TrackingNumber { get; set; } = string.Empty;

    public ShipmentStatus ShipmentStatus { get; set; }

    public ShippingOrderStatus ShippingOrderStatus { get; set; }

    public DateTime DepartedAtUtc { get; set; }
}