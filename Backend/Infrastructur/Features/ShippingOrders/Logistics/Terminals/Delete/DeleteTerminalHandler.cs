using Application.Features.Logistics.Terminals.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Terminals.Delete;

public class DeleteTerminalHandler : IDeleteTerminalHandler
{
    private readonly AppDbContext _context;

    public DeleteTerminalHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var terminal = await _context.Terminals
            .FirstOrDefaultAsync(terminal => terminal.Id == id);

        if (terminal is null)
            return false;

        _context.Terminals.Remove(terminal);

        await _context.SaveChangesAsync();

        return true;
    }
}