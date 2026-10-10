using Application.Features.Logistics.Voyages.GetById.DTOs;
using Application.Features.Logistics.Voyages.Update.DTOs;

namespace Application.Features.Logistics.Voyages.Update.Interfaces;

public interface IUpdateVoyageHandler
{
    Task<GetVoyageByIdResponseDto?> HandleAsync(
        int id,
        UpdateVoyageRequestDto request);
}