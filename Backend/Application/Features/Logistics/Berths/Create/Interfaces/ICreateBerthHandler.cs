using Application.Features.Logistics.Berths.Create.DTOs;

namespace Application.Features.Logistics.Berths.Create.Interfaces;

public interface ICreateBerthHandler
{
    Task<CreateBerthResponseDto?> HandleAsync(
        CreateBerthRequestDto request);
}