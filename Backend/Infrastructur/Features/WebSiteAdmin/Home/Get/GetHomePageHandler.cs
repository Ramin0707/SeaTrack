using Application.Features.WebSiteAdmin.Home.Get.DTOs;
using Application.Features.WebSiteAdmin.Home.Get.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Home.Get;

public class GetHomePageHandler : IGetHomePageHandler
{
    private readonly AppDbContext _context;

    public GetHomePageHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetHomePageResponseDto> HandleAsync()
    {
        var homePage = await _context.HomePageContents
            .Include(page => page.Sections)
            .OrderBy(page => page.Id)
            .FirstOrDefaultAsync();

        if (homePage is null)
        {
            homePage = new HomePageContent
            {
                Name = "Home Page",
                CreatedAtUtc = DateTime.UtcNow
            };

            _context.HomePageContents.Add(homePage);

            await _context.SaveChangesAsync();
        }
        else if (string.IsNullOrWhiteSpace(homePage.Name))
        {
            homePage.Name = "Home Page";
            homePage.UpdatedAtUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        return new GetHomePageResponseDto
        {
            Id = homePage.Id,
            Name = homePage.Name,
            CreatedAtUtc = homePage.CreatedAtUtc,
            UpdatedAtUtc = homePage.UpdatedAtUtc,

            Sections = homePage.Sections
                .OrderBy(section => section.SortOrder)
                .ThenBy(section => section.Id)
                .Select(section => new HomePageSectionDto
                {
                    Id = section.Id,
                    SectionType = section.SectionType,
                    Name = section.Name,
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