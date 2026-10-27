using Application.Features.WebSiteAdmin.About.Update.DTOs;

namespace Application.Features.WebSiteAdmin.About.Update.Interfaces;

public interface IUpdateAboutPageSectionHandler
{
    Task<UpdateAboutPageSectionResponseDto?> HandleAsync(
        int id,
        UpdateAboutPageSectionRequestDto request);
}