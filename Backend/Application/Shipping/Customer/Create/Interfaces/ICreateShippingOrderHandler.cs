using Application.Features.Shipping.Customer.Create.DTOs;

namespace Application.Features.Shipping.Customer.Create.Interfaces;

public interface ICreateShippingOrderHandler
{
    Task<CreateShippingOrderResponseDto> HandleAsync(
        string customerId,
        CreateShippingOrderRequestDto request);
}