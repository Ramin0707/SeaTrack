using Application.Features.Shipping.LogisticsAdmin.GetById.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.GetById.Interfaces;

public interface IGetShippingOrderByIdHandler
{
    Task<GetShippingOrderByIdResponseDto?> HandleAsync(int id);
}