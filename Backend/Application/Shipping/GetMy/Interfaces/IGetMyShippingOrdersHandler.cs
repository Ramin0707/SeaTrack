using Application.Features.ShippingOrders.GetMy.DTOs;

namespace Application.Features.ShippingOrders.GetMy.Interfaces;

public interface IGetMyShippingOrdersHandler
{
    Task<List<GetMyShippingOrderResponseDto>> HandleAsync(string customerId);
}