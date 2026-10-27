using System.Text.Json;
using Application.Features.WebSiteAdmin.Services.Items.Update.DTOs;
using Application.Features.WebSiteAdmin.Services.Items.Update.Interfaces;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Services.Items.Update;

public class UpdateServiceItemHandler
    : IUpdateServiceItemHandler
{
    private readonly AppDbContext _context;

    private static readonly JsonSerializerOptions JsonOptions =
        new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

    public UpdateServiceItemHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HandleAsync(
        int id,
        UpdateServiceItemRequestDto request)
    {
        var serviceItem = await _context.ServicesPageItems
            .FirstOrDefaultAsync(x => x.Id == id);

        if (serviceItem is null)
        {
            return false;
        }

        serviceItem.Name =
            request.Name.Trim();

        serviceItem.Number =
            request.Number.Trim();

        serviceItem.Label =
            request.Label.Trim();

        serviceItem.Title =
            request.Title.Trim();

        serviceItem.HighlightedTitle =
            request.HighlightedTitle.Trim();

        serviceItem.Description =
            request.Description.Trim();

        serviceItem.ImageBadge =
            request.ImageBadge.Trim();

        serviceItem.ImageUrl =
            string.IsNullOrWhiteSpace(request.ImageUrl)
                ? null
                : request.ImageUrl.Trim();

        serviceItem.ImageAlt =
            string.IsNullOrWhiteSpace(request.ImageAlt)
                ? null
                : request.ImageAlt.Trim();

        serviceItem.BenefitsJson =
            JsonSerializer.Serialize(
                request.Benefits ?? new(),
                JsonOptions);

        serviceItem.ButtonText =
            request.ButtonText.Trim();

        serviceItem.ButtonUrl =
            request.ButtonUrl.Trim();

        serviceItem.SortOrder =
            request.SortOrder;

        serviceItem.IsVisible =
            request.IsVisible;

        serviceItem.UpdatedAtUtc =
            DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }
}