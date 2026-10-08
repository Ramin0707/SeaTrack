using Application.Features.Logistics.Terminals.GetById.DTOs;
using Application.Features.Logistics.Terminals.GetById.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Terminals.GetById;

public class GetTerminalByIdHandler : IGetTerminalByIdHandler
{
    private readonly AppDbContext _context;

    public GetTerminalByIdHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetTerminalByIdResponseDto?> HandleAsync(int id)
    {
        return await _context.Terminals
            .AsNoTracking()
            .Where(terminal => terminal.Id == id)
            .Select(terminal => new GetTerminalByIdResponseDto
            {
                Id = terminal.Id,
                PortId = terminal.PortId,
                PortName = terminal.Port.Name,
                Name = terminal.Name,
                Code = terminal.Code,
                IsActive = terminal.IsActive
            })
            .FirstOrDefaultAsync();
    }
}