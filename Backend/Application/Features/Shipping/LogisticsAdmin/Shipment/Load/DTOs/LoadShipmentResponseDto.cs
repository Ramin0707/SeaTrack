using Domain.Enums;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Load.DTOs;

public class LoadShipmentResponseDto
{
    public int ShipmentId { get; set; }

    public int ShippingOrderId { get; set; }

    public string TrackingNumber { get; set; } = string.Empty;

    public ShipmentStatus ShipmentStatus { get; set; }
}