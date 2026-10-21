using Application.Features.WebSiteAdmin.Home.Visibility.DTOs;

namespace Application.Features.WebSiteAdmin.Home.Visibility.Interfaces;

public interface IUpdateHomePageSectionVisibilityHandler
{
    Task<UpdateHomePageSectionVisibilityResponseDto?> HandleAsync(
        int id,
        UpdateHomePageSectionVisibilityRequestDto request);
}