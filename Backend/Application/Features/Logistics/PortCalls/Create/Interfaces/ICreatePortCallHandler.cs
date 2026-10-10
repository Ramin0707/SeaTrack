using Application.Features.Logistics.PortCalls.Create.DTOs;

namespace Application.Features.Logistics.PortCalls.Create.Interfaces;

public interface ICreatePortCallHandler
{
    Task<CreatePortCallResponseDto?> HandleAsync(
        CreatePortCallRequestDto request);
}