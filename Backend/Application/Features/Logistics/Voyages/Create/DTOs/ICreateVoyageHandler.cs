using Application.Features.Logistics.Voyages.Create.DTOs;

namespace Application.Features.Logistics.Voyages.Create.Interfaces;

public interface ICreateVoyageHandler
{
    Task<CreateVoyageResponseDto?> HandleAsync(
        CreateVoyageRequestDto request);
}