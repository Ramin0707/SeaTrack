using Application.Features.WebSiteAdmin.About.Reorder.DTOs;
using Application.Features.WebSiteAdmin.About.Reorder.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.About.Reorder;

public class ReorderAboutPageSectionsHandler
    : IReorderAboutPageSectionsHandler
{
    private readonly AppDbContext _context;

    public ReorderAboutPageSectionsHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(
        ReorderAboutPageSectionsRequestDto request)
    {
        if (request.Items is null ||
            request.Items.Count == 0)
        {
            return false;
        }

        if (request.Items.Any(item =>
                item.Id <= 0 ||
                item.SortOrder <= 0))
        {
            return false;
        }

        var ids = request.Items
            .Select(item => item.Id)
            .ToList();

        if (ids.Distinct().Count() != ids.Count)
        {
            return false;
        }

        var sortOrders = request.Items
            .Select(item => item.SortOrder)
            .ToList();

        if (sortOrders.Distinct().Count() !=
            sortOrders.Count)
        {
            return false;
        }

        var sections = await _context.AboutPageSections
            .Where(section => ids.Contains(section.Id))
            .ToListAsync();

        if (sections.Count != ids.Count)
        {
            return false;
        }

        var aboutPageIds = sections
            .Select(section => section.AboutPageContentId)
            .Distinct()
            .ToList();

        if (aboutPageIds.Count != 1)
        {
            return false;
        }

        var now = DateTime.UtcNow;

        foreach (var item in request.Items)
        {
            var section = sections
                .First(section => section.Id == item.Id);

            section.SortOrder = item.SortOrder;
            section.UpdatedAtUtc = now;
        }

        var aboutPageId = aboutPageIds[0];

        var aboutPage = await _context.AboutPageContents
            .FirstOrDefaultAsync(
                page => page.Id == aboutPageId);

        if (aboutPage is not null)
        {
            aboutPage.UpdatedAtUtc = now;
        }

        await _context.SaveChangesAsync();

        return true;
    }
}