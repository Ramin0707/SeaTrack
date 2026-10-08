using Application.Features.Logistics.Vessels.GetAll.DTOs;

namespace Application.Features.Logistics.Vessels.GetAll.Interfaces;

public interface IGetAllVesselsHandler
{
    Task<List<GetAllVesselsResponseDto>> HandleAsync();
}