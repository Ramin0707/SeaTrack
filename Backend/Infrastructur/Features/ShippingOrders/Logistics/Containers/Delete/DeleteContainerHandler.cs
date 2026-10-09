using Application.Features.Logistics.Containers.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.Logistics.Containers.Delete;

public class DeleteContainerHandler : IDeleteContainerHandler
{
    private readonly AppDbContext _context;

    public DeleteContainerHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var container = await _context.Containers
            .FirstOrDefaultAsync(container => container.Id == id);

        if (container is null)
            return false;

        _context.Containers.Remove(container);

        await _context.SaveChangesAsync();

        return true;
    }
}