using Application.Features.Logistics.Berths.Create.DTOs;
using Application.Features.Logistics.Berths.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Berths.Create;

public class CreateBerthHandler : ICreateBerthHandler
{
    private readonly AppDbContext _context;

    public CreateBerthHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateBerthResponseDto?> HandleAsync(
        CreateBerthRequestDto request)
    {
        var terminalExists = await _context.Terminals
            .AnyAsync(terminal => terminal.Id == request.TerminalId);

        if (!terminalExists)
            return null;

        var normalizedCode = request.Code
            .Trim()
            .ToUpperInvariant();

        var codeExists = await _context.Berths
            .AnyAsync(berth => berth.Code == normalizedCode);

        if (codeExists)
            return null;

        var berth = new Berth
        {
            TerminalId = request.TerminalId,
            Name = request.Name.Trim(),
            Code = normalizedCode,
            MaxDepth = request.MaxDepth,
            MaxVesselLength = request.MaxVesselLength,
            IsActive = true
        };

        _context.Berths.Add(berth);

        await _context.SaveChangesAsync();

        return new CreateBerthResponseDto
        {
            Id = berth.Id,
            TerminalId = berth.TerminalId,
            Name = berth.Name,
            Code = berth.Code,
            MaxDepth = berth.MaxDepth,
            MaxVesselLength = berth.MaxVesselLength,
            IsActive = berth.IsActive
        };
    }
}