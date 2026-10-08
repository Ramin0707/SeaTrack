using Application.Features.Logistics.Vessels.Create.DTOs;

namespace Application.Features.Logistics.Vessels.Create.Interfaces;

public interface ICreateVesselHandler
{
    Task<CreateVesselResponseDto?> HandleAsync(
        CreateVesselRequestDto request);
}