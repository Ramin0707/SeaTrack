using Application.Features.Logistics.Routes.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Routes.Delete;

public class DeleteRouteHandler : IDeleteRouteHandler
{
    private readonly AppDbContext _context;

    public DeleteRouteHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var route = await _context.Routes
            .FirstOrDefaultAsync(route => route.Id == id);

        if (route is null)
            return false;

        _context.Routes.Remove(route);

        await _context.SaveChangesAsync();

        return true;
    }
}