using Application.Features.Logistics.Containers.Create.DTOs;

namespace Application.Features.Logistics.Containers.Create.Interfaces;

public interface ICreateContainerHandler
{
    Task<CreateContainerResponseDto?> HandleAsync(
        CreateContainerRequestDto request);
}