using Application.Features.WebSiteAdmin.About.Visibility.DTOs;

namespace Application.Features.WebSiteAdmin.About.Visibility.Interfaces;

public interface IUpdateAboutPageSectionVisibilityHandler
{
    Task<bool> HandleAsync(
        int id,
        UpdateAboutPageSectionVisibilityRequestDto request);
}