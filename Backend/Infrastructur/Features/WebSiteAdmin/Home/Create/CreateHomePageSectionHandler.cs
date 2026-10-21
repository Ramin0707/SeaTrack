using Application.Features.WebSiteAdmin.Home.Create.DTOs;
using Application.Features.WebSiteAdmin.Home.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Home.Create;

public class CreateHomePageSectionHandler
    : ICreateHomePageSectionHandler
{
    private readonly AppDbContext _context;

    public CreateHomePageSectionHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateHomePageSectionResponseDto> HandleAsync(
        CreateHomePageSectionRequestDto request)
    {
        var homePage = await _context.HomePageContents
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

        var sectionType = GetCanonicalSectionType(
            request.SectionType);

        var currentMaxSortOrder =
            await _context.HomePageSections
                .Where(section =>
                    section.HomePageContentId == homePage.Id)
                .MaxAsync(section =>
                    (int?)section.SortOrder) ?? 0;

        var now = DateTime.UtcNow;

        var section = new HomePageSection
        {
            HomePageContentId = homePage.Id,

            SectionType = sectionType,

            Name = string.IsNullOrWhiteSpace(request.Name)
                ? GetDefaultSectionName(sectionType)
                : request.Name.Trim(),

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

        _context.HomePageSections.Add(section);

        homePage.UpdatedAtUtc = now;

        await _context.SaveChangesAsync();

        return new CreateHomePageSectionResponseDto
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
        };
    }

    private static string GetCanonicalSectionType(
        string sectionType)
    {
        var value = sectionType?.Trim();

        if (string.Equals(
            value,
            "Hero",
            StringComparison.OrdinalIgnoreCase))
        {
            return "Hero";
        }

        if (string.Equals(
            value,
            "Services",
            StringComparison.OrdinalIgnoreCase))
        {
            return "Services";
        }

        if (string.Equals(
            value,
            "GlobalNetwork",
            StringComparison.OrdinalIgnoreCase))
        {
            return "GlobalNetwork";
        }

        if (string.Equals(
            value,
            "Tracking",
            StringComparison.OrdinalIgnoreCase))
        {
            return "Tracking";
        }

        if (string.Equals(
            value,
            "Destinations",
            StringComparison.OrdinalIgnoreCase))
        {
            return "Destinations";
        }

        if (string.Equals(
            value,
            "WhySeaTrack",
            StringComparison.OrdinalIgnoreCase))
        {
            return "WhySeaTrack";
        }

        if (string.Equals(
            value,
            "CallToAction",
            StringComparison.OrdinalIgnoreCase))
        {
            return "CallToAction";
        }

        throw new ArgumentException(
            $"Unsupported Home Page section type: {sectionType}");
    }

    private static string GetDefaultSectionName(
        string sectionType)
    {
        return sectionType switch
        {
            "Hero" => "Hero",
            "Services" => "Services",
            "GlobalNetwork" => "Global Network",
            "Tracking" => "Tracking",
            "Destinations" => "Destinations",
            "WhySeaTrack" => "Why SeaTrack",
            "CallToAction" => "Call To Action",
            _ => sectionType
        };
    }
}