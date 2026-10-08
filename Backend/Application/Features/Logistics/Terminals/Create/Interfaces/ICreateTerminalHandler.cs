using Application.Features.Logistics.Terminals.Create.DTOs;

namespace Application.Features.Logistics.Terminals.Create.Interfaces;

public interface ICreateTerminalHandler
{
    Task<CreateTerminalResponseDto?> HandleAsync(
        CreateTerminalRequestDto request);
}