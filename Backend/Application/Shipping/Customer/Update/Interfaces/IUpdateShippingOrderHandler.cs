using Application.Features.Shipping.Customer.Update.DTOs;

namespace Application.Features.Shipping.Customer.Update.Interfaces;

public interface IUpdateShippingOrderHandler
{
    Task<UpdateShippingOrderResponseDto?> HandleAsync(
        int id,
        string customerId,
        UpdateShippingOrderRequestDto request);
}