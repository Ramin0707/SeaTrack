using Application.Features.Logistics.Vessels.GetAll.DTOs;
using Application.Features.Logistics.Vessels.GetAll.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Vessels.GetAll;

public class GetAllVesselsHandler : IGetAllVesselsHandler
{
    private readonly AppDbContext _context;

    public GetAllVesselsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetAllVesselsResponseDto>> HandleAsync()
    {
        return await _context.Vessels
            .AsNoTracking()
            .OrderBy(vessel => vessel.Name)
            .Select(vessel => new GetAllVesselsResponseDto
            {
                Id = vessel.Id,
                Name = vessel.Name,
                ImoNumber = vessel.ImoNumber,
                CallSign = vessel.CallSign,
                Flag = vessel.Flag,
                Length = vessel.Length,
                Width = vessel.Width,
                MaxDraft = vessel.MaxDraft,
                DeadweightTonnage = vessel.DeadweightTonnage,
                IsActive = vessel.IsActive
            })
            .ToListAsync();
    }
}