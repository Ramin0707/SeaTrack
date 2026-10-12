using Application.Features.Shipping.LogisticsAdmin.Shipment.GetAll.DTOs;

namespace Application.Features.Shipping.LogisticsAdmin.Shipment.GetAll.Interfaces;

public interface IGetAllShipmentsHandler
{
    Task<List<GetAllShipmentsResponseDto>> HandleAsync();
}