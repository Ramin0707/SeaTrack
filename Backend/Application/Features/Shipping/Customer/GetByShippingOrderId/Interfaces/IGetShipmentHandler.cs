using Application.Features.Shipping.Customer.Shipment.GetByShippingOrderId.DTOs;

namespace Application.Features.Shipping.Customer.Shipment.GetByShippingOrderId.Interfaces;

public interface IGetShipmentHandler
{
    Task<GetShipmentResponseDto?> HandleAsync(
        int shippingOrderId,
        string customerId);
}