using Application.Features.Logistics.Berths.GetById.DTOs;

namespace Application.Features.Logistics.Berths.GetById.Interfaces;

public interface IGetBerthByIdHandler
{
    Task<GetBerthByIdResponseDto?> HandleAsync(int id);
}