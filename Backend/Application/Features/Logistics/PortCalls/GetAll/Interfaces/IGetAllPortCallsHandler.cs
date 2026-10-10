using Application.Features.Logistics.PortCalls.GetAll.DTOs;

namespace Application.Features.Logistics.PortCalls.GetAll.Interfaces;

public interface IGetAllPortCallsHandler
{
    Task<List<GetAllPortCallsResponseDto>> HandleAsync();
}