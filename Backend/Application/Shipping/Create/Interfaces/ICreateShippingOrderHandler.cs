using Application.Features.ShippingOrders.Create.DTOs;

namespace Application.Features.ShippingOrders.Create.Interfaces;

public interface ICreateShippingOrderHandler
{
    Task<CreateShippingOrderResponseDto> HandleAsync(
        string customerId,
        CreateShippingOrderRequestDto request);
}