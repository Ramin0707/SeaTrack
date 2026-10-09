using Application.Features.Logistics.Containers.GetById.DTOs;

namespace Application.Features.Logistics.Containers.GetById.Interfaces;

public interface IGetContainerByIdHandler
{
    Task<GetContainerByIdResponseDto?> HandleAsync(int id);
}