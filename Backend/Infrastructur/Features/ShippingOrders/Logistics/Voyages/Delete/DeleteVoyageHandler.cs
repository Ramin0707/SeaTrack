using Application.Features.Logistics.Voyages.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Voyages.Delete;

public class DeleteVoyageHandler : IDeleteVoyageHandler
{
    private readonly AppDbContext _context;

    public DeleteVoyageHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var voyage = await _context.Voyages
            .FirstOrDefaultAsync(voyage => voyage.Id == id);

        if (voyage is null)
            return false;

        _context.Voyages.Remove(voyage);

        await _context.SaveChangesAsync();

        return true;
    }
}