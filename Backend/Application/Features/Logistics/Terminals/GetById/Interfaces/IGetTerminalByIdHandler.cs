using Application.Features.Logistics.Terminals.GetById.DTOs;

namespace Application.Features.Logistics.Terminals.GetById.Interfaces;

public interface IGetTerminalByIdHandler
{
    Task<GetTerminalByIdResponseDto?> HandleAsync(int id);
}