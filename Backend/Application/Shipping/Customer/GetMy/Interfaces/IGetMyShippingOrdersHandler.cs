using Application.Features.Shipping.Customer.GetMy.DTOs;

namespace Application.Features.Shipping.Customer.GetMy.Interfaces;

public interface IGetMyShippingOrdersHandler
{
    Task<List<GetMyShippingOrderResponseDto>> HandleAsync(string customerId);
}