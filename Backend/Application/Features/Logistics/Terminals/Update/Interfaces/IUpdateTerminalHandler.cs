using Application.Features.Logistics.Terminals.GetById.DTOs;
using Application.Features.Logistics.Terminals.Update.DTOs;

namespace Application.Features.Logistics.Terminals.Update.Interfaces;

public interface IUpdateTerminalHandler
{
    Task<GetTerminalByIdResponseDto?> HandleAsync(
        int id,
        UpdateTerminalRequestDto request);
}