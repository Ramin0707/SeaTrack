using Application.Features.WebSiteAdmin.About.Reorder.DTOs;

namespace Application.Features.WebSiteAdmin.About.Reorder.Interfaces;

public interface IReorderAboutPageSectionsHandler
{
    Task<bool> HandleAsync(
        ReorderAboutPageSectionsRequestDto request);
}