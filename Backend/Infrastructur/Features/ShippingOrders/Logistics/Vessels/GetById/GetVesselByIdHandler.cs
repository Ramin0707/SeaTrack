using Application.Features.Logistics.Vessels.GetById.DTOs;
using Application.Features.Logistics.Vessels.GetById.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Vessels.GetById;

public class GetVesselByIdHandler : IGetVesselByIdHandler
{
    private readonly AppDbContext _context;

    public GetVesselByIdHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetVesselByIdResponseDto?> HandleAsync(int id)
    {
        return await _context.Vessels
            .AsNoTracking()
            .Where(vessel => vessel.Id == id)
            .Select(vessel => new GetVesselByIdResponseDto
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
            .FirstOrDefaultAsync();
    }
}