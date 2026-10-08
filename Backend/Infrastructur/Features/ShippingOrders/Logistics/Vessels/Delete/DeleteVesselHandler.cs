using Application.Features.Logistics.Vessels.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Vessels.Delete;

public class DeleteVesselHandler : IDeleteVesselHandler
{
    private readonly AppDbContext _context;

    public DeleteVesselHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var vessel = await _context.Vessels
            .FirstOrDefaultAsync(vessel => vessel.Id == id);

        if (vessel is null)
            return false;

        _context.Vessels.Remove(vessel);

        await _context.SaveChangesAsync();

        return true;
    }
}