using Application.Features.WebSiteAdmin.Services.Items.Update.DTOs;

namespace Application.Features.WebSiteAdmin.Services.Items.Update.Interfaces;

public interface IUpdateServiceItemHandler
{
    Task<bool> HandleAsync(
        int id,
        UpdateServiceItemRequestDto request);
}