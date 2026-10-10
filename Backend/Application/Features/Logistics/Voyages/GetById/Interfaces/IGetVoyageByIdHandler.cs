using Application.Features.Logistics.Voyages.GetById.DTOs;

namespace Application.Features.Logistics.Voyages.GetById.Interfaces;

public interface IGetVoyageByIdHandler
{
    Task<GetVoyageByIdResponseDto?> HandleAsync(int id);
}
