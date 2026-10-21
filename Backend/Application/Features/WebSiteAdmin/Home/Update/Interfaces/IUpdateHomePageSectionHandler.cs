using Application.Features.WebSiteAdmin.Home.Update.DTOs;

namespace Application.Features.WebSiteAdmin.Home.Update.Interfaces;

public interface IUpdateHomePageSectionHandler
{
    Task<UpdateHomePageSectionResponseDto?> HandleAsync(
        int id,
        UpdateHomePageSectionRequestDto request);
}