using Application.Features.Logistics.Berths.GetById.DTOs;
using Application.Features.Logistics.Berths.GetById.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Berths.GetById;

public class GetBerthByIdHandler : IGetBerthByIdHandler
{
    private readonly AppDbContext _context;

    public GetBerthByIdHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetBerthByIdResponseDto?> HandleAsync(int id)
    {
        return await _context.Berths
            .AsNoTracking()
            .Where(berth => berth.Id == id)
            .Select(berth => new GetBerthByIdResponseDto
            {
                Id = berth.Id,
                TerminalId = berth.TerminalId,
                TerminalName = berth.Terminal.Name,
                Name = berth.Name,
                Code = berth.Code,
                MaxDepth = berth.MaxDepth,
                MaxVesselLength = berth.MaxVesselLength,
                IsActive = berth.IsActive
            })
            .FirstOrDefaultAsync();
    }
}