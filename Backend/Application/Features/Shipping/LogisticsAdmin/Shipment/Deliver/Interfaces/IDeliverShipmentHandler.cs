using Application.Features.Shipping.LogisticsAdmin.Shipment.Deliver.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Deliver.Interfaces;

public interface IDeliverShipmentHandler
{
    Task<DeliverShipmentResponseDto?> HandleAsync(int shippingOrderId);
}