using Application.Features.Logistics.PortCalls.GetById.DTOs;

namespace Application.Features.Logistics.PortCalls.GetById.Interfaces;

public interface IGetPortCallByIdHandler
{
    Task<GetPortCallByIdResponseDto?> HandleAsync(int id);
}