using Application.Features.Logistics.Vessels.GetById.DTOs;
using Application.Features.Logistics.Vessels.Update.DTOs;

namespace Application.Features.Logistics.Vessels.Update.Interfaces;

public interface IUpdateVesselHandler
{
    Task<GetVesselByIdResponseDto?> HandleAsync(
        int id,
        UpdateVesselRequestDto request);
}