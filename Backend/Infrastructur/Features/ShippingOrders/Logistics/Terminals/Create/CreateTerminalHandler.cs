using Application.Features.Logistics.Terminals.Create.DTOs;
using Application.Features.Logistics.Terminals.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Terminals.Create;

public class CreateTerminalHandler : ICreateTerminalHandler
{
    private readonly AppDbContext _context;

    public CreateTerminalHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateTerminalResponseDto?> HandleAsync(
        CreateTerminalRequestDto request)
    {
        var portExists = await _context.Ports
            .AnyAsync(port => port.Id == request.PortId);

        if (!portExists)
            return null;

        var normalizedCode = request.Code
            .Trim()
            .ToUpperInvariant();

        var codeExists = await _context.Terminals
            .AnyAsync(terminal => terminal.Code == normalizedCode);

        if (codeExists)
            return null;

        var terminal = new Terminal
        {
            PortId = request.PortId,
            Name = request.Name.Trim(),
            Code = normalizedCode,
            IsActive = true
        };

        _context.Terminals.Add(terminal);

        await _context.SaveChangesAsync();

        return new CreateTerminalResponseDto
        {
            Id = terminal.Id,
            PortId = terminal.PortId,
            Name = terminal.Name,
            Code = terminal.Code,
            IsActive = terminal.IsActive
        };
    }
}