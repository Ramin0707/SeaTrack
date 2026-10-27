using System.Text.Json;
using Application.Features.WebSiteAdmin.Services.Items.Create.DTOs;
using Application.Features.WebSiteAdmin.Services.Items.Create.Interfaces;
using Domain.Entities;
using Infrastructur.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructur.Features.WebSiteAdmin.Services.Items.Create;

public class CreateServiceItemHandler
    : ICreateServiceItemHandler
{
    private readonly AppDbContext _context;

    private static readonly JsonSerializerOptions JsonOptions =
        new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

    public CreateServiceItemHandler(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<int?> HandleAsync(
        CreateServiceItemRequestDto request)
    {
        var servicesPage = await _context.ServicesPageContents
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

        if (servicesPage is null)
        {
            return null;
        }

        var serviceItem = new ServicesPageItem
        {
            Name = request.Name.Trim(),
            Number = request.Number.Trim(),
            Label = request.Label.Trim(),
            Title = request.Title.Trim(),
            HighlightedTitle = request.HighlightedTitle.Trim(),
            Description = request.Description.Trim(),
            ImageBadge = request.ImageBadge.Trim(),

            ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl)
                ? null
                : request.ImageUrl.Trim(),

            ImageAlt = string.IsNullOrWhiteSpace(request.ImageAlt)
                ? null
                : request.ImageAlt.Trim(),

            BenefitsJson = JsonSerializer.Serialize(
                request.Benefits ?? new(),
                JsonOptions),

            ButtonText = request.ButtonText.Trim(),
            ButtonUrl = request.ButtonUrl.Trim(),

            SortOrder = request.SortOrder,
            IsVisible = request.IsVisible,

            ServicesPageContentId = servicesPage.Id,

            CreatedAtUtc = DateTime.UtcNow
        };

        _context.ServicesPageItems.Add(serviceItem);

        await _context.SaveChangesAsync();

        return serviceItem.Id;
    }
}