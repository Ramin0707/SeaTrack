using Application.Features.Shipping.LogisticsAdmin.Shipment.Load.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Load.Interfaces;

public interface ILoadShipmentHandler
{
    Task<LoadShipmentResponseDto?> HandleAsync(int shippingOrderId);
}