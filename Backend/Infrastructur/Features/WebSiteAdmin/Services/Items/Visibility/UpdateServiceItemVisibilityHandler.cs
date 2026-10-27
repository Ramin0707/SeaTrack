using Application.Features.WebSiteAdmin.Services.Items.Visibility.DTOs;
using Application.Features.WebSiteAdmin.Services.Items.Visibility.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Services.Items.Visibility;

public class UpdateServiceItemVisibilityHandler
    : IUpdateServiceItemVisibilityHandler
{
    private readonly AppDbContext _context;

    public UpdateServiceItemVisibilityHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(
        int id,
        UpdateServiceItemVisibilityRequestDto request)
    {
        var serviceItem = await _context.ServicesPageItems
            .FirstOrDefaultAsync(x => x.Id == id);

        if (serviceItem is null)
        {
            return false;
        }

        serviceItem.IsVisible = request.IsVisible;
        serviceItem.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }
}