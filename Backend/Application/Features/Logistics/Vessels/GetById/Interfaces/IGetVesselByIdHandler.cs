using Application.Features.Logistics.Vessels.GetById.DTOs;

namespace Application.Features.Logistics.Vessels.GetById.Interfaces;

public interface IGetVesselByIdHandler
{
    Task<GetVesselByIdResponseDto?> HandleAsync(int id);
}