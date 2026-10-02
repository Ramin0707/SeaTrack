using Application.Features.Shipping.GetById.DTOs;

namespace Application.Features.Shipping.GetById.Interfaces;

public interface IGetShippingOrderByIdHandler
{
    Task<GetShippingOrderByIdResponseDto?> HandleAsync(int id, string customerId);
}