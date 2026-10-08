using Application.Features.Logistics.Ports.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Ports.Delete;

public class DeletePortHandler : IDeletePortHandler
{
    private readonly AppDbContext _context;

    public DeletePortHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var port = await _context.Ports
            .FirstOrDefaultAsync(port => port.Id == id);

        if (port is null)
            return false;

        _context.Ports.Remove(port);

        await _context.SaveChangesAsync();

        return true;
    }
}