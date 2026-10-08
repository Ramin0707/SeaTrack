using Application.Features.Logistics.Ports.Create.DTOs;
using Application.Features.Logistics.Ports.GetAll.DTOs;

namespace Application.Features.Logistics.Ports.Create.Interfaces;

public interface ICreatePortHandler
{
    Task<PortDto?> HandleAsync(CreatePortRequestDto request);
}