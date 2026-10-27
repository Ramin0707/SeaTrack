using Application.Features.WebSiteAdmin.About.Create.DTOs;
using Application.Features.WebSiteAdmin.About.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.About.Create;

public class CreateAboutPageSectionHandler
    : ICreateAboutPageSectionHandler
{
    private readonly AppDbContext _context;

    public CreateAboutPageSectionHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateAboutPageSectionResponseDto> HandleAsync(
        CreateAboutPageSectionRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.SectionType))
        {
            throw new ArgumentException(
                "Section type is required.");
        }

        var aboutPage = await _context.AboutPageContents
            .OrderBy(page => page.Id)
            .FirstOrDefaultAsync();

        if (aboutPage is null)
        {
            aboutPage = new AboutPageContent
            {
                Name = "About Page",
                CreatedAtUtc = DateTime.UtcNow
            };

            _context.AboutPageContents.Add(aboutPage);

            await _context.SaveChangesAsync();
        }

        var currentMaxSortOrder =
            await _context.AboutPageSections
                .Where(section =>
                    section.AboutPageContentId == aboutPage.Id)
                .MaxAsync(section =>
                    (int?)section.SortOrder) ?? 0;

        var now = DateTime.UtcNow;

        var section = new AboutPageSection
        {
            AboutPageContentId = aboutPage.Id,

            SectionType = request.SectionType.Trim(),

            SortOrder = currentMaxSortOrder + 1,

            IsVisible = request.IsVisible,

            ContentJson = string.IsNullOrWhiteSpace(
                request.ContentJson)
                    ? "{}"
                    : request.ContentJson.Trim(),

            ImageUrl = string.IsNullOrWhiteSpace(
                request.ImageUrl)
                    ? null
                    : request.ImageUrl.Trim(),

            CreatedAtUtc = now
        };

        _context.AboutPageSections.Add(section);

        aboutPage.UpdatedAtUtc = now;

        await _context.SaveChangesAsync();

        return new CreateAboutPageSectionResponseDto
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