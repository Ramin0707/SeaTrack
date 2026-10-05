using Application.Features.Shipping.LogisticsAdmin.GetAll.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.GetAll.Interfaces;

public interface IGetAllShippingOrdersHandler
{
    Task<List<GetAllShippingOrderResponseDto>> HandleAsync();
}