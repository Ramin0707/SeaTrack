using Application.Features.Logistics.Berths.GetAll.DTOs;

namespace Application.Features.Logistics.Berths.GetAll.Interfaces;

public interface IGetAllBerthsHandler
{
    Task<List<GetAllBerthsResponseDto>> HandleAsync();
}