using System.Text.Json;
using Application.Features.WebSiteAdmin.Services.Update.DTOs;
using Application.Features.WebSiteAdmin.Services.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Services.Update;

public class UpdateServicesPageHandler
    : IUpdateServicesPageHandler
{
    private readonly AppDbContext _context;

    private static readonly JsonSerializerOptions JsonOptions =
        new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

    public UpdateServicesPageHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(
        UpdateServicesPageRequestDto request)
    {
        var page = await _context.ServicesPageContents
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

        if (page is null)
        {
            return false;
        }

        page.Name = request.Name.Trim();

        page.HeroLabel =
            request.HeroLabel.Trim();

        page.HeroTitle =
            request.HeroTitle.Trim();

        page.HeroHighlightedTitle =
            request.HeroHighlightedTitle.Trim();

        page.HeroDescription =
            request.HeroDescription.Trim();

        page.HeroStatsJson =
            JsonSerializer.Serialize(
                request.HeroStats ?? new(),
                JsonOptions);

        page.CapabilitiesTitle =
            request.CapabilitiesTitle.Trim();

        page.CapabilitiesJson =
            JsonSerializer.Serialize(
                request.Capabilities ?? new(),
                JsonOptions);

        page.ScrollText =
            request.ScrollText.Trim();

        page.UpdatedAtUtc =
            DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }
}