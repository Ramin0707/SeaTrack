using Application.Features.Shipping.LogisticsAdmin.Shipment.Create.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Create.Interfaces;

public interface ICreateShipmentHandler
{
    Task<CreateShipmentResponseDto?> HandleAsync(int shippingOrderId);
}