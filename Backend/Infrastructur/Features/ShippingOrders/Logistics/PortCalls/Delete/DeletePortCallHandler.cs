using Application.Features.Logistics.PortCalls.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.PortCalls.Delete;

public class DeletePortCallHandler : IDeletePortCallHandler
{
    private readonly AppDbContext _context;

    public DeletePortCallHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var portCall = await _context.PortCalls
            .FirstOrDefaultAsync(portCall => portCall.Id == id);

        if (portCall is null)
            return false;

        _context.PortCalls.Remove(portCall);

        await _context.SaveChangesAsync();

        return true;
    }
}