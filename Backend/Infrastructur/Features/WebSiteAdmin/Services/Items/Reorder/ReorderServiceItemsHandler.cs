using Application.Features.WebSiteAdmin.Services.Items.Reorder.DTOs;
using Application.Features.WebSiteAdmin.Services.Items.Reorder.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Services.Items.Reorder;

public class ReorderServiceItemsHandler
    : IReorderServiceItemsHandler
{
    private readonly AppDbContext _context;

    public ReorderServiceItemsHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(
        ReorderServiceItemsRequestDto request)
    {
        if (request.Items is null ||
            request.Items.Count == 0)
        {
            return false;
        }

        var ids = request.Items
            .Select(x => x.Id)
            .Distinct()
            .ToList();

        if (ids.Count != request.Items.Count)
        {
            return false;
        }

        var serviceItems = await _context.ServicesPageItems
            .Where(x => ids.Contains(x.Id))
            .ToListAsync();

        if (serviceItems.Count != ids.Count)
        {
            return false;
        }

        var orderById = request.Items
            .ToDictionary(
                x => x.Id,
                x => x.SortOrder);

        var updatedAtUtc = DateTime.UtcNow;

        foreach (var serviceItem in serviceItems)
        {
            serviceItem.SortOrder =
                orderById[serviceItem.Id];

            serviceItem.UpdatedAtUtc =
                updatedAtUtc;
        }

        await _context.SaveChangesAsync();

        return true;
    }
}