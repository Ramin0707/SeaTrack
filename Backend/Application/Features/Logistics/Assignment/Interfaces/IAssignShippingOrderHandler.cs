using Application.Features.ShippingOrders.LogisticsAdmin.Assignment.DTOs;

namespace Application.Features.ShippingOrders.LogisticsAdmin.Assignment.Interfaces;

public interface IAssignShippingOrderHandler
{
    Task<bool> HandleAsync(
        int orderId,
        AssignShippingOrderRequestDto request);
}