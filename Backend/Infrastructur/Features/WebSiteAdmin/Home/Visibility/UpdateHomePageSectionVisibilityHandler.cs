using Application.Features.WebSiteAdmin.Home.Visibility.DTOs;
using Application.Features.WebSiteAdmin.Home.Visibility.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Home.Visibility;

public class UpdateHomePageSectionVisibilityHandler
    : IUpdateHomePageSectionVisibilityHandler
{
    private readonly AppDbContext _context;

    public UpdateHomePageSectionVisibilityHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateHomePageSectionVisibilityResponseDto?>
        HandleAsync(
            int id,
            UpdateHomePageSectionVisibilityRequestDto request)
    {
        var section = await _context.HomePageSections
            .FirstOrDefaultAsync(section => section.Id == id);

        if (section is null)
        {
            return null;
        }

        var now = DateTime.UtcNow;

        section.IsVisible = request.IsVisible;
        section.UpdatedAtUtc = now;

        var homePage = await _context.HomePageContents
            .FirstOrDefaultAsync(
                page => page.Id == section.HomePageContentId);

        if (homePage is not null)
        {
            homePage.UpdatedAtUtc = now;
        }

        await _context.SaveChangesAsync();

        return new UpdateHomePageSectionVisibilityResponseDto
        {
            Id = section.Id,
            SectionType = section.SectionType,
            Name = section.Name,
            SortOrder = section.SortOrder,
            IsVisible = section.IsVisible,
            UpdatedAtUtc = section.UpdatedAtUtc
        };
    }
}