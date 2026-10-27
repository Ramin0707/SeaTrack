using Application.Features.WebSiteAdmin.About.Update.DTOs;
using Application.Features.WebSiteAdmin.About.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.About.Update;

public class UpdateAboutPageSectionHandler
    : IUpdateAboutPageSectionHandler
{
    private readonly AppDbContext _context;

    public UpdateAboutPageSectionHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateAboutPageSectionResponseDto?> HandleAsync(
        int id,
        UpdateAboutPageSectionRequestDto request)
    {
        var section = await _context.AboutPageSections
            .FirstOrDefaultAsync(section => section.Id == id);

        if (section is null)
        {
            return null;
        }

        if (string.IsNullOrWhiteSpace(request.SectionType))
        {
            throw new ArgumentException(
                "Section type is required.");
        }

        var now = DateTime.UtcNow;

        section.SectionType = request.SectionType.Trim();

        section.IsVisible = request.IsVisible;

        section.ContentJson =
            string.IsNullOrWhiteSpace(request.ContentJson)
                ? "{}"
                : request.ContentJson.Trim();

        section.ImageUrl =
            string.IsNullOrWhiteSpace(request.ImageUrl)
                ? null
                : request.ImageUrl.Trim();

        section.UpdatedAtUtc = now;

        var aboutPage = await _context.AboutPageContents
            .FirstOrDefaultAsync(
                page => page.Id == section.AboutPageContentId);

        if (aboutPage is not null)
        {
            aboutPage.UpdatedAtUtc = now;
        }

        await _context.SaveChangesAsync();

        return new UpdateAboutPageSectionResponseDto
        {
            Id = section.Id,
            SectionType = section.SectionType,
            SortOrder = section.SortOrder,
            IsVisible = section.IsVisible,
            ContentJson = section.ContentJson,
            ImageUrl = section.ImageUrl,
            CreatedAtUtc = section.CreatedAtUtc,
            UpdatedAtUtc = section.UpdatedAtUtc
        };
    }
}