using Application.Features.Shipping.LogisticsAdmin.Shipment.Unload.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Unload.Interfaces;

public interface IUnloadShipmentHandler
{
    Task<UnloadShipmentResponseDto?> HandleAsync(int shippingOrderId);
}