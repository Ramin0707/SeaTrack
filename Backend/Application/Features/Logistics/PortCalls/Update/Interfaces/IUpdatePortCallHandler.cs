using Application.Features.Logistics.PortCalls.GetById.DTOs;
using Application.Features.Logistics.PortCalls.Update.DTOs;

namespace Application.Features.Logistics.PortCalls.Update.Interfaces;

public interface IUpdatePortCallHandler
{
    Task<GetPortCallByIdResponseDto?> HandleAsync(
        int id,
        UpdatePortCallRequestDto request);
}