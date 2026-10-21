using Application.Features.WebSiteAdmin.Home.Update.DTOs;
using Application.Features.WebSiteAdmin.Home.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Home.Update;

public class UpdateHomePageSectionHandler
    : IUpdateHomePageSectionHandler
{
    private readonly AppDbContext _context;

    public UpdateHomePageSectionHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateHomePageSectionResponseDto?> HandleAsync(
        int id,
        UpdateHomePageSectionRequestDto request)
    {
        var section = await _context.HomePageSections
            .FirstOrDefaultAsync(section => section.Id == id);

        if (section is null)
        {
            return null;
        }

        var sectionType = GetCanonicalSectionType(
            request.SectionType);

        section.SectionType = sectionType;

        section.Name = string.IsNullOrWhiteSpace(request.Name)
            ? GetDefaultSectionName(sectionType)
            : request.Name.Trim();

        section.IsVisible = request.IsVisible;

        section.ContentJson =
            string.IsNullOrWhiteSpace(request.ContentJson)
                ? "{}"
                : request.ContentJson.Trim();

        section.ImageUrl =
            string.IsNullOrWhiteSpace(request.ImageUrl)
                ? null
                : request.ImageUrl.Trim();

        section.UpdatedAtUtc = DateTime.UtcNow;

        var homePage = await _context.HomePageContents
            .FirstOrDefaultAsync(
                page => page.Id == section.HomePageContentId);

        if (homePage is not null)
        {
            homePage.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return new UpdateHomePageSectionResponseDto
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