using Application.Features.PublicWebsite.Home.Get.DTOs;
using Application.Features.PublicWebsite.Home.Get.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.PublicWebsite.Home.Get;

public class GetPublicHomePageHandler
    : IGetPublicHomePageHandler
{
    private readonly AppDbContext _context;

    public GetPublicHomePageHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetPublicHomePageResponseDto?> HandleAsync()
    {
        var homePage = await _context.HomePageContents
            .AsNoTracking()
            .Include(page => page.Sections)
            .OrderBy(page => page.Id)
            .FirstOrDefaultAsync();

        if (homePage is null)
        {
            return null;
        }

        return new GetPublicHomePageResponseDto
        {
            Id = homePage.Id,
            Name = homePage.Name,

            Sections = homePage.Sections
                .Where(section => section.IsVisible)
                .OrderBy(section => section.SortOrder)
                .ThenBy(section => section.Id)
                .Select(section =>
                    new PublicHomePageSectionDto
                    {
                        Id = section.Id,
                        SectionType = section.SectionType,
                        Name = section.Name,
                        SortOrder = section.SortOrder,
                        ContentJson = section.ContentJson,
                        ImageUrl = section.ImageUrl
                    })
                .ToList()
        };
    }
}