using Application.Features.Logistics.Berths.GetById.DTOs;
using Application.Features.Logistics.Berths.Update.DTOs;

namespace Application.Features.Logistics.Berths.Update.Interfaces;

public interface IUpdateBerthHandler
{
    Task<GetBerthByIdResponseDto?> HandleAsync(
        int id,
        UpdateBerthRequestDto request);
}