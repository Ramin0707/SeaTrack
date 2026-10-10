using Application.Features.Logistics.Routes.GetAll.DTOs;

namespace Application.Features.Logistics.Routes.GetAll.Interfaces;

public interface IGetAllRoutesHandler
{
    Task<List<GetAllRoutesResponseDto>> HandleAsync();
}