using System.Text.Json;
using Application.Features.WebSiteAdmin.Services.Get.DTOs;
using Application.Features.WebSiteAdmin.Services.Get.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Services.Get;

public class GetServicesPageHandler
    : IGetServicesPageHandler
{
    private readonly AppDbContext _context;

    public GetServicesPageHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<GetServicesPageResponseDto?> HandleAsync()
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

        return new GetServicesPageResponseDto
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

            CreatedAtUtc =
                page.CreatedAtUtc,

            UpdatedAtUtc =
                page.UpdatedAtUtc,

            Services = page.Services
                .OrderBy(x => x.SortOrder)
                .ThenBy(x => x.Id)
                .Select(x => new AdminServiceItemDto
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
                        x.SortOrder,

                    IsVisible =
                        x.IsVisible,

                    CreatedAtUtc =
                        x.CreatedAtUtc,

                    UpdatedAtUtc =
                        x.UpdatedAtUtc
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