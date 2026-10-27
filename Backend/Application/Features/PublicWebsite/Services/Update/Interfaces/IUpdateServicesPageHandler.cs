using Application.Features.WebSiteAdmin.Services.Update.DTOs;

namespace Application.Features.WebSiteAdmin.Services.Update.Interfaces;

public interface IUpdateServicesPageHandler
{
    Task<bool> HandleAsync(
        UpdateServicesPageRequestDto request);
}