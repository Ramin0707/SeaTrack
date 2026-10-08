using Application.Features.Logistics.Ports.GetById.DTOs;
using Application.Features.Logistics.Ports.Update.DTOs;

namespace Application.Features.Logistics.Ports.Update.Interfaces;

public interface IUpdatePortHandler
{
    Task<GetPortByIdResponseDto?> HandleAsync(
        int id,
        UpdatePortRequestDto request);
}