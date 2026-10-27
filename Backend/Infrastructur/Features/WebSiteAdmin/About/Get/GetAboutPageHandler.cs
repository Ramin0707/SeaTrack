using Application.Features.WebSiteAdmin.About.Get.DTOs;
using Application.Features.WebSiteAdmin.About.Get.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.About.Get;

public class GetAboutPageHandler : IGetAboutPageHandler
{
    private readonly AppDbContext _context;

    public GetAboutPageHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetAboutPageResponseDto> HandleAsync()
    {
        var aboutPage = await _context.AboutPageContents
            .Include(page => page.Sections)
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
        else if (string.IsNullOrWhiteSpace(aboutPage.Name))
        {
            aboutPage.Name = "About Page";
            aboutPage.UpdatedAtUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        return new GetAboutPageResponseDto
        {
            Id = aboutPage.Id,
            Name = aboutPage.Name,
            CreatedAtUtc = aboutPage.CreatedAtUtc,
            UpdatedAtUtc = aboutPage.UpdatedAtUtc,

            Sections = aboutPage.Sections
                .OrderBy(section => section.SortOrder)
                .ThenBy(section => section.Id)
                .Select(section => new AboutPageSectionDto
                {
                    Id = section.Id,
                    SectionType = section.SectionType,
                    SortOrder = section.SortOrder,
                    IsVisible = section.IsVisible,
                    ContentJson = section.ContentJson,
                    ImageUrl = section.ImageUrl,
                    CreatedAtUtc = section.CreatedAtUtc,
                    UpdatedAtUtc = section.UpdatedAtUtc
                })
                .ToList()
        };
    }
}