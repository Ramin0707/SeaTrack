using Application.Features.Logistics.Terminals.GetAll.DTOs;
using Application.Features.Logistics.Terminals.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Terminals.GetAll;

public class GetAllTerminalsHandler : IGetAllTerminalsHandler
{
    private readonly AppDbContext _context;

    public GetAllTerminalsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetAllTerminalsResponseDto>> HandleAsync()
    {
        return await _context.Terminals
            .AsNoTracking()
            .OrderBy(terminal => terminal.Name)
            .Select(terminal => new GetAllTerminalsResponseDto
            {
                Id = terminal.Id,
                PortId = terminal.PortId,
                PortName = terminal.Port.Name,
                Name = terminal.Name,
                Code = terminal.Code,
                IsActive = terminal.IsActive
            })
            .ToListAsync();
    }
}