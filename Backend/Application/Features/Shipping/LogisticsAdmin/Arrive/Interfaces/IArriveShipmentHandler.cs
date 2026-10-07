using Application.Features.Shipping.LogisticsAdmin.Shipment.Arrive.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Arrive.Interfaces;

public interface IArriveShipmentHandler
{
    Task<ArriveShipmentResponseDto?> HandleAsync(int shippingOrderId);
}