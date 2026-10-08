using Application.Features.Logistics.Terminals.GetById.DTOs;
using Application.Features.Logistics.Terminals.Update.DTOs;
using Application.Features.Logistics.Terminals.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Terminals.Update;

public class UpdateTerminalHandler : IUpdateTerminalHandler
{
    private readonly AppDbContext _context;

    public UpdateTerminalHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetTerminalByIdResponseDto?> HandleAsync(
        int id,
        UpdateTerminalRequestDto request)
    {
        var terminal = await _context.Terminals
            .FirstOrDefaultAsync(terminal => terminal.Id == id);

        if (terminal is null)
            return null;

        var portExists = await _context.Ports
            .AnyAsync(port => port.Id == request.PortId);

        if (!portExists)
            return null;

        var normalizedCode = request.Code
            .Trim()
            .ToUpperInvariant();

        var codeExists = await _context.Terminals
            .AnyAsync(terminal =>
                terminal.Id != id &&
                terminal.Code == normalizedCode);

        if (codeExists)
            return null;

        terminal.PortId = request.PortId;
        terminal.Name = request.Name.Trim();
        terminal.Code = normalizedCode;
        terminal.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        var portName = await _context.Ports
            .Where(port => port.Id == terminal.PortId)
            .Select(port => port.Name)
            .FirstAsync();

        return new GetTerminalByIdResponseDto
        {
            Id = terminal.Id,
            PortId = terminal.PortId,
            PortName = portName,
            Name = terminal.Name,
            Code = terminal.Code,
            IsActive = terminal.IsActive
        };
    }
}