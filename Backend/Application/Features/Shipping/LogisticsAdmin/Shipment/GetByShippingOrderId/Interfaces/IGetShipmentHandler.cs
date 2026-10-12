using Application.Features.Shipping.LogisticsAdmin.Shipment.GetByShippingOrderId.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.GetByShippingOrderId.Interfaces;

public interface IGetShipmentHandler
{
    Task<GetShipmentResponseDto?> HandleAsync(int shippingOrderId);
}