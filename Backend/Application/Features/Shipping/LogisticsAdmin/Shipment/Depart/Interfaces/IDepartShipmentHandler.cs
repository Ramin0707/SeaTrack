using Application.Features.Shipping.LogisticsAdmin.Shipment.Depart.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.Depart.Interfaces;

public interface IDepartShipmentHandler
{
    Task<DepartShipmentResponseDto?> HandleAsync(int shippingOrderId);
}