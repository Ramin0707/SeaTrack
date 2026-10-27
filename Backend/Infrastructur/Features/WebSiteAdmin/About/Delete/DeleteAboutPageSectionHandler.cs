using Application.Features.WebSiteAdmin.About.Delete.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.About.Delete;

public class DeleteAboutPageSectionHandler
    : IDeleteAboutPageSectionHandler
{
    private readonly AppDbContext _context;

    public DeleteAboutPageSectionHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(int id)
    {
        var section = await _context.AboutPageSections
            .FirstOrDefaultAsync(section => section.Id == id);

        if (section is null)
        {
            return false;
        }

        var aboutPage = await _context.AboutPageContents
            .FirstOrDefaultAsync(
                page => page.Id == section.AboutPageContentId);

        _context.AboutPageSections.Remove(section);

        if (aboutPage is not null)
        {
            aboutPage.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return true;
    }
}