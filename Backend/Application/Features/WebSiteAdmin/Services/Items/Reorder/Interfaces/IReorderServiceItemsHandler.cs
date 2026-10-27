using Application.Features.WebSiteAdmin.Services.Items.Reorder.DTOs;

namespace Application.Features.WebSiteAdmin.Services.Items.Reorder.Interfaces;

public interface IReorderServiceItemsHandler
{
    Task<bool> HandleAsync(
        ReorderServiceItemsRequestDto request);
}