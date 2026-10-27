using Application.Features.WebSiteAdmin.About.Visibility.DTOs;
using Application.Features.WebSiteAdmin.About.Visibility.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.About.Visibility;

public class UpdateAboutPageSectionVisibilityHandler
    : IUpdateAboutPageSectionVisibilityHandler
{
    private readonly AppDbContext _context;

    public UpdateAboutPageSectionVisibilityHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(
        int id,
        UpdateAboutPageSectionVisibilityRequestDto request)
    {
        var section = await _context.AboutPageSections
            .FirstOrDefaultAsync(section => section.Id == id);

        if (section is null)
        {
            return false;
        }

        var now = DateTime.UtcNow;

        section.IsVisible = request.IsVisible;
        section.UpdatedAtUtc = now;

        var aboutPage = await _context.AboutPageContents
            .FirstOrDefaultAsync(
                page => page.Id == section.AboutPageContentId);

        if (aboutPage is not null)
        {
            aboutPage.UpdatedAtUtc = now;
        }

        await _context.SaveChangesAsync();

        return true;
    }
}