using Application.Features.WebSiteAdmin.Home.Reorder.DTOs;
using Application.Features.WebSiteAdmin.Home.Reorder.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Home.Reorder;

public class ReorderHomePageSectionsHandler
    : IReorderHomePageSectionsHandler
{
    private readonly AppDbContext _context;

    public ReorderHomePageSectionsHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<ReorderHomePageSectionsResponseDto> HandleAsync(
        ReorderHomePageSectionsRequestDto request)
    {
        if (request.SectionIds is null ||
            request.SectionIds.Count == 0)
        {
            throw new ArgumentException(
                "SectionIds cannot be empty.");
        }

        if (request.SectionIds.Count !=
            request.SectionIds.Distinct().Count())
        {
            throw new ArgumentException(
                "SectionIds cannot contain duplicate IDs.");
        }

        var homePage = await _context.HomePageContents
            .OrderBy(page => page.Id)
            .FirstOrDefaultAsync();

        if (homePage is null)
        {
            throw new InvalidOperationException(
                "Home Page does not exist.");
        }

        var sections = await _context.HomePageSections
            .Where(section =>
                section.HomePageContentId == homePage.Id)
            .ToListAsync();

        if (sections.Count != request.SectionIds.Count)
        {
            throw new ArgumentException(
                "All Home Page section IDs must be provided.");
        }

        var existingIds = sections
            .Select(section => section.Id)
            .OrderBy(id => id)
            .ToList();

        var requestedIds = request.SectionIds
            .OrderBy(id => id)
            .ToList();

        if (!existingIds.SequenceEqual(requestedIds))
        {
            throw new ArgumentException(
                "One or more section IDs are invalid.");
        }

        var now = DateTime.UtcNow;

        for (var index = 0;
             index < request.SectionIds.Count;
             index++)
        {
            var sectionId = request.SectionIds[index];

            var section = sections.First(
                section => section.Id == sectionId);

            section.SortOrder = index + 1;
            section.UpdatedAtUtc = now;
        }

        homePage.UpdatedAtUtc = now;

        await _context.SaveChangesAsync();

        var orderedSections = sections
            .OrderBy(section => section.SortOrder)
            .Select(section =>
                new ReorderedHomePageSectionDto
                {
                    Id = section.Id,
                    SectionType = section.SectionType,
                    Name = section.Name,
                    SortOrder = section.SortOrder,
                    IsVisible = section.IsVisible
                })
            .ToList();

        return new ReorderHomePageSectionsResponseDto
        {
            Sections = orderedSections
        };
    }
}