using Application.Features.PublicWebsite.About.Get.DTOs;
using Application.Features.PublicWebsite.About.Get.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.PublicWebsite.About.Get;

public class GetPublicAboutPageHandler
    : IGetPublicAboutPageHandler
{
    private readonly AppDbContext _context;

    public GetPublicAboutPageHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetPublicAboutPageResponseDto?> HandleAsync()
    {
        var aboutPage = await _context.AboutPageContents
            .AsNoTracking()
            .Include(page => page.Sections)
            .OrderBy(page => page.Id)
            .FirstOrDefaultAsync();

        if (aboutPage is null)
        {
            return null;
        }

        return new GetPublicAboutPageResponseDto
        {
            Id = aboutPage.Id,
            Name = aboutPage.Name,

            Sections = aboutPage.Sections
                .Where(section => section.IsVisible)
                .OrderBy(section => section.SortOrder)
                .ThenBy(section => section.Id)
                .Select(section =>
                    new PublicAboutPageSectionDto
                    {
                        Id = section.Id,
                        SectionType = section.SectionType,
                        SortOrder = section.SortOrder,
                        ContentJson = section.ContentJson,
                        ImageUrl = section.ImageUrl
                    })
                .ToList()
        };
    }
}