using Application.Features.Logistics.Berths.GetAll.DTOs;
using Application.Features.Logistics.Berths.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Berths.GetAll;

public class GetAllBerthsHandler : IGetAllBerthsHandler
{
    private readonly AppDbContext _context;

    public GetAllBerthsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetAllBerthsResponseDto>> HandleAsync()
    {
        return await _context.Berths
            .AsNoTracking()
            .OrderBy(berth => berth.Name)
            .Select(berth => new GetAllBerthsResponseDto
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
            .ToListAsync();
    }
}