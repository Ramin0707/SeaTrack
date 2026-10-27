using Application.Features.WebSiteAdmin.Services.Items.Visibility.DTOs;

namespace Application.Features.WebSiteAdmin.Services.Items.Visibility.Interfaces;

public interface IUpdateServiceItemVisibilityHandler
{
    Task<bool> HandleAsync(
        int id,
        UpdateServiceItemVisibilityRequestDto request);
}