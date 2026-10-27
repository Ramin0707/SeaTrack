using Application.Features.WebSiteAdmin.Services.Items.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Services.Items.Delete;

public class DeleteServiceItemHandler
    : IDeleteServiceItemHandler
{
    private readonly AppDbContext _context;

    public DeleteServiceItemHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var serviceItem = await _context.ServicesPageItems
            .FirstOrDefaultAsync(x => x.Id == id);

        if (serviceItem is null)
        {
            return false;
        }

        _context.ServicesPageItems.Remove(serviceItem);

        await _context.SaveChangesAsync();

        return true;
    }
}