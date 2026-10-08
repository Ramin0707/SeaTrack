using Application.Features.Logistics.Ports.GetAll.DTOs;

namespace Application.Features.Logistics.Ports.GetAll.Interfaces;

public interface IGetAllPortsHandler
{
    Task<List<PortDto>> HandleAsync();
}