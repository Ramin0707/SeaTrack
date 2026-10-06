using Domain.Enums;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Create.DTOs;

public class CreateShipmentResponseDto
{
    public int Id { get; set; }

    public int ShippingOrderId { get; set; }

    public string TrackingNumber { get; set; } = string.Empty;

    public ShipmentStatus Status { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}