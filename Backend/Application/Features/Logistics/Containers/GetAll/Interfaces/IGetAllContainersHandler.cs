using Application.Features.Logistics.Containers.GetAll.DTOs;

namespace Application.Features.Logistics.Containers.GetAll.Interfaces;

public interface IGetAllContainersHandler
{
    Task<List<GetAllContainersResponseDto>> HandleAsync();
}