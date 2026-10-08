using Application.Features.Logistics.Ports.GetById.DTOs;

namespace Application.Features.Logistics.Ports.GetById.Interfaces;

public interface IGetPortByIdHandler
{
    Task<GetPortByIdResponseDto?> HandleAsync(int id);
}