using Application.Features.Shipping.Customer.GetById.DTOs;

namespace Application.Features.Shipping.Customer.GetById.Interfaces;

public interface IGetShippingOrderByIdHandler
{
    Task<GetShippingOrderByIdResponseDto?> HandleAsync(int id, string customerId);
}