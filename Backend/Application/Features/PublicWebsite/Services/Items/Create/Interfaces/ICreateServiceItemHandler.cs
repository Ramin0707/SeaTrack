using Application.Features.WebSiteAdmin.Services.Items.Create.DTOs;

namespace Application.Features.WebSiteAdmin.Services.Items.Create.Interfaces;

public interface ICreateServiceItemHandler
{
    Task<int?> HandleAsync(
        CreateServiceItemRequestDto request);
}