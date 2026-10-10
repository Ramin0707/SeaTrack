using Application.Features.Logistics.Voyages.GetAll.DTOs;

namespace Application.Features.Logistics.Voyages.GetAll.Interfaces;

public interface IGetAllVoyagesHandler
{
    Task<List<GetAllVoyagesResponseDto>> HandleAsync();
}