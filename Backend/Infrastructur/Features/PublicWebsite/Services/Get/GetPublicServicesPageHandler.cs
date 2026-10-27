using System.Text.Json;
using Application.Features.PublicWebsite.Services.Get.DTOs;
using Application.Features.PublicWebsite.Services.Get.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.PublicWebsite.Services.Get;

public class GetPublicServicesPageHandler
    : IGetPublicServicesPageHandler
{
    private readonly AppDbContext _context;

    public GetPublicServicesPageHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetPublicServicesPageResponseDto?> HandleAsync()
    {
        var page = await _context.ServicesPageContents
            .AsNoTracking()
            .Include(x => x.Services)
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

        if (page is null)
        {
            return null;
        }

        return new GetPublicServicesPageResponseDto
        {
            Id = page.Id,

            Name = page.Name,

            HeroLabel = page.HeroLabel,

            HeroTitle = page.HeroTitle,

            HeroHighlightedTitle =
                page.HeroHighlightedTitle,

            HeroDescription =
                page.HeroDescription,

            HeroStats =
                ParseJsonArray(page.HeroStatsJson),

            CapabilitiesTitle =
                page.CapabilitiesTitle,

            Capabilities =
                ParseJsonArray(page.CapabilitiesJson),

            ScrollText =
                page.ScrollText,

            Services = page.Services
                .Where(x => x.IsVisible)
                .OrderBy(x => x.SortOrder)
                .Select(x => new PublicServiceItemDto
                {
                    Id = x.Id,

                    Name = x.Name,

                    Number = x.Number,

                    Label = x.Label,

                    Title = x.Title,

                    HighlightedTitle =
                        x.HighlightedTitle,

                    Description =
                        x.Description,

                    ImageBadge =
                        x.ImageBadge,

                    ImageUrl =
                        x.ImageUrl,

                    ImageAlt =
                        x.ImageAlt,

                    Benefits =
                        ParseJsonArray(x.BenefitsJson),

                    ButtonText =
                        x.ButtonText,

                    ButtonUrl =
                        x.ButtonUrl,

                    SortOrder =
                        x.SortOrder
                })
                .ToList()
        };
    }


    private static JsonElement ParseJsonArray(
        string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return EmptyArray();
        }

        try
        {
            using var document =
                JsonDocument.Parse(json);

            if (document.RootElement.ValueKind
                != JsonValueKind.Array)
            {
                return EmptyArray();
            }

            return document.RootElement.Clone();
        }
        catch (JsonException)
        {
            return EmptyArray();
        }
    }


    private static JsonElement EmptyArray()
    {
        using var document =
            JsonDocument.Parse("[]");

        return document.RootElement.Clone();
    }
}