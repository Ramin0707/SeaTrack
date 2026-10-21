using Application.Features.WebSiteAdmin.Home.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Home.Delete;

public class DeleteHomePageSectionHandler
    : IDeleteHomePageSectionHandler
{
    private readonly AppDbContext _context;

    public DeleteHomePageSectionHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var section = await _context.HomePageSections
            .FirstOrDefaultAsync(section => section.Id == id);

        if (section is null)
        {
            return false;
        }

        var homePageContentId = section.HomePageContentId;

        _context.HomePageSections.Remove(section);

        var remainingSections = await _context.HomePageSections
            .Where(section =>
                section.HomePageContentId == homePageContentId &&
                section.Id != id)
            .OrderBy(section => section.SortOrder)
            .ThenBy(section => section.Id)
            .ToListAsync();

        for (var index = 0;
             index < remainingSections.Count;
             index++)
        {
            remainingSections[index].SortOrder = index + 1;
        }

        var homePage = await _context.HomePageContents
            .FirstOrDefaultAsync(
                page => page.Id == homePageContentId);

        if (homePage is not null)
        {
            homePage.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return true;
    }
}