using Application.Features.Logistics.Berths.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Berths.Delete;

public class DeleteBerthHandler : IDeleteBerthHandler
{
    private readonly AppDbContext _context;

    public DeleteBerthHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var berth = await _context.Berths
            .FirstOrDefaultAsync(berth => berth.Id == id);

        if (berth is null)
            return false;

        _context.Berths.Remove(berth);

        await _context.SaveChangesAsync();

        return true;
    }
}