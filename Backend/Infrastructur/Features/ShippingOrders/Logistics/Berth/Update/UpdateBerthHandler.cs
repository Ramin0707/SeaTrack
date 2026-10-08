using Application.Features.Logistics.Berths.GetById.DTOs;
using Application.Features.Logistics.Berths.Update.DTOs;
using Application.Features.Logistics.Berths.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Berths.Update;

public class UpdateBerthHandler : IUpdateBerthHandler
{
    private readonly AppDbContext _context;

    public UpdateBerthHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetBerthByIdResponseDto?> HandleAsync(
        int id,
        UpdateBerthRequestDto request)
    {
        var berth = await _context.Berths
            .FirstOrDefaultAsync(berth => berth.Id == id);

        if (berth is null)
            return null;

        var terminal = await _context.Terminals
            .FirstOrDefaultAsync(terminal => terminal.Id == request.TerminalId);

        if (terminal is null)
            return null;

        var normalizedCode = request.Code
            .Trim()
            .ToUpperInvariant();

        var codeExists = await _context.Berths
            .AnyAsync(berth =>
                berth.Id != id &&
                berth.Code == normalizedCode);

        if (codeExists)
            return null;

        berth.TerminalId = request.TerminalId;
        berth.Name = request.Name.Trim();
        berth.Code = normalizedCode;
        berth.MaxDepth = request.MaxDepth;
        berth.MaxVesselLength = request.MaxVesselLength;
        berth.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new GetBerthByIdResponseDto
        {
            Id = berth.Id,
            TerminalId = berth.TerminalId,
            TerminalName = terminal.Name,
            Name = berth.Name,
            Code = berth.Code,
            MaxDepth = berth.MaxDepth,
            MaxVesselLength = berth.MaxVesselLength,
            IsActive = berth.IsActive
        };
    }
}