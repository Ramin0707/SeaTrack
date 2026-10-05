using Application.Features.Shipping.Customer.Cancel.DTOs;

namespace Application.Features.Shipping.Customer.Cancel.Interfaces;

public interface ICancelShippingOrderHandler
{
    Task<CancelShippingOrderResponseDto?> HandleAsync(int id,string customerId);
}