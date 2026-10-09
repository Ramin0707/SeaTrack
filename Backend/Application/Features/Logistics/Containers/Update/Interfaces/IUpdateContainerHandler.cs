using Application.Features.Logistics.Containers.GetById.DTOs;
using Application.Features.Logistics.Containers.Update.DTOs;

namespace Application.Features.Logistics.Containers.Update.Interfaces;

public interface IUpdateContainerHandler
{
    Task<GetContainerByIdResponseDto?> HandleAsync(
        int id,
        UpdateContainerRequestDto request);
}