using Application.Features.Shipping.LogisticsAdmin.Shipment.Start.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Start.Interfaces;

public interface IStartShipmentHandler
{
    Task<StartShipmentResponseDto?> HandleAsync(int shippingOrderId);
}